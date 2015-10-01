/**
 * This file is part of power-ui, originally developed by Futurice Oy.
 *
 * power-ui is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/* global describe, it, require */
/* eslint max-nested-callbacks:0, no-unused-expressions:0 */
import chai from 'chai';
const expect = chai.expect;
chai.use(require('chai-virtual-dom'));
import {mockDOMResponse} from '@cycle/dom';
import {Rx} from '@cycle/core';
import {API_PATH} from 'power-ui/conf';
import PowerheadPage from './index';
import PowerheadPageHTTP from './http';
import select from 'vtree-select';
import {combineReports, augmentReportsWithMetadata} from './reportUtils';
import _ from 'lodash';
import {mockPowerheadResponse} from './testdata';

function createPowerheadPageObject(vtree) {
  const reportCount = select('.tribe_report')(vtree).length;

  const internals = select('.ints')(vtree)
    .map(el => el.children[1].children[0].text);

  const externals = select('.exts')(vtree)
    .map(el => el.children[1].children[0].text);

  const bench = select('.bench')(vtree)
    .map(el => el.children[1].children[0].text);

  const booked = select('.booked')(vtree)
    .map(el => el.children[1].children[0].text);

  const confirmed_revenue = select('.confirmed_revenue')(vtree)
    .map(el => el.children[2].children[0].text);

  const overruns = select('.overruns')(vtree)
    .map(el => el.children[2].children[0].text);

  return {
    reportCount, internals, externals, bench, booked, confirmed_revenue, overruns,
  };
}

describe('augmentReportsWithMetadata', () => {
  it('should be a function', () => {
    expect(augmentReportsWithMetadata).to.be.a('function');
  });

  it('should add costs to reports', () => {
    const augmentedReports = augmentReportsWithMetadata(mockPowerheadResponse.results);
    expect(augmentedReports[0].costs).to.eql([55000, 55000, 55000, 55000]);
    expect(augmentedReports[1].costs).to.eql([88000, 88000, 88000, 88000]);
  });

  it('should add financialsSum to reports', () => {
    const augmentedReports = augmentReportsWithMetadata(mockPowerheadResponse.results);
    expect(augmentedReports[0].financialsSum).to.eql([1005, 1005, 1005, 1005]);
    expect(augmentedReports[1].financialsSum).to.eql([2010, 2010, 2010, 2010]);
  });

  it('should add maxFinancialsVal to reports', () => {
    const augmentedReports = augmentReportsWithMetadata(mockPowerheadResponse.results);
    expect(augmentedReports[0].maxFinancialsVal).to.eql(55000);
    expect(augmentedReports[1].maxFinancialsVal).to.eql(88000);
  });

  it('should add companyWideMaxFinancialsVal to reports', () => {
    const augmentedReports = augmentReportsWithMetadata(mockPowerheadResponse.results);
    expect(augmentedReports[0].companyWideMaxFinancialsVal).to.eql(88000);
    expect(augmentedReports[1].companyWideMaxFinancialsVal).to.eql(88000);
  });
});

describe('combineReports', () => {
  it('should be a function', () => {
    expect(combineReports).to.be.a('function');
  });

  it('should combine array of n reports to array of 1 report', () => {
    const reports = mockPowerheadResponse.results;
    const combinedReportArray = combineReports(reports);
    expect(combinedReportArray).to.have.length.of(1);
  });

  describe('combined report', () => {
    const combinedArray = combineReports(mockPowerheadResponse.results);
    const combined = combinedArray[0];

    it('should have costs calculated correctly', () => {
      expect(combined.costs).to.eql([143000, 143000, 143000, 143000]);
    });
    it('should have financialsSum calculated correctly', () => {
      expect(combined.financialsSum).to.eql([3015, 3015, 3015, 3015]);
    });
    it('should have maxFinancialsVal calculated correctly', () => {
      expect(combined.maxFinancialsVal).to.eql(143000);
    });
    it('should have companyWideMaxFinancialsVal calculated correctly', () => {
      expect(combined.companyWideMaxFinancialsVal).to.eql(143000);
    });
  });
});

describe('PowerheadPageHTTP', () => {
  it('should be a function', () => {
    expect(PowerheadPageHTTP).to.be.a('function');
  });

  it('calling the HTTP should return a request with url', (done) => {
    const props$ = Rx.Observable.just({});
    const HTTPSource = Rx.Observable.empty();
    const {request$} = PowerheadPageHTTP({props$, HTTP: HTTPSource});

    request$.subscribe(req => {
      expect(_.startsWith(req.url, `${API_PATH}/powerhead/`)).to.be.true;
      done();
    });
  });

  it('should map the responses to body.results', (done) => {
    const props$ = Rx.Observable.just({});
    const HTTPSource = new Rx.ReplaySubject(1);
    const {request$, response$} = PowerheadPageHTTP({props$, HTTP: HTTPSource});

    response$.subscribe(response => {
      expect(response).to.equal('test');
      done();
    });

    request$.map(req => {
      const res$ = Rx.Observable.just({
        request: req,
        body: {results: 'test'},
      });
      res$.request = req;
      return res$;
    }).subscribe(HTTPSource.asObserver());
  });
});

describe('PowerheadPage', () => {
  it('should be a function', () => {
    expect(PowerheadPage).to.be.a('function');
  });

  describe('using filter "all"', () => {
    const props$ = Rx.Observable.just({
      location: 'all',
      lookaheadLength: 1,
      reportLength: 2,
    });

    const HTTPsource$ = new Rx.ReplaySubject(1);

    const DOMSource = mockDOMResponse();

    const powerHeadPage = PowerheadPage({
      DOM: DOMSource,
      HTTP: HTTPsource$,
      props$,
    });

    const request$ = powerHeadPage.HTTP;

    request$.map(request => {
      const mockedResponse$ = Rx.Observable.just({
        body: mockPowerheadResponse,
      });
      mockedResponse$.request = request;
      return mockedResponse$;
    }).subscribe(HTTPsource$.asObserver());

    powerHeadPage.DOM.elementAt(0).subscribe(vtree => {
      const page = createPowerheadPageObject(vtree);

      it('should have a single report', () => {
        expect(page.reportCount).to.equal(1);
      });

      it('should have a sum of internals from all reports, for each month', () => {
        expect(page.internals).to.eql(['30','30','30']);
      });

      it('should have a sum of bench from all reports, for each month', () => {
        expect(page.bench).to.eql(['5','5','5']);
      });

      it('should have a sum of booked from all reports, for each month', () => {
        expect(page.booked).to.eql(['25','25','25']);
      });

      it('should have a sum of externals from all reports, for each month', () => {
        expect(page.externals).to.eql(['3','3','3']);
      });

      it('should have a sum revenue from all reports, for each month', () => {
        expect(page.confirmed_revenue).to.eql(['3 000', '3 000', '3 000']);
      });

      it('should have a sum overruns from all reports, for each month', () => {
        expect(page.overruns).to.eql(['15','15','15']);
      });
    });
  });
});
