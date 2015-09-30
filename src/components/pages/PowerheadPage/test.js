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
/* global describe, it */
import chai from 'chai';
const expect = chai.expect;
chai.use(require('chai-virtual-dom'));
import {h, mockDOMResponse} from '@cycle/dom';
import {Rx} from '@cycle/core';
import {API_PATH} from 'power-ui/conf';
import PowerheadPage from './index';
import PowerheadPageHTTP from './http';
import moment from "moment";
import {replicateStream} from 'power-ui/utils';
import select from 'vtree-select';

const mockData = {"count":2,"next":null,"previous":null,"results":[{"id":1,"months":[{"September":"2015-09-01"},{"October":"2015-10-01"},{"November":"2015-11-01"},{"December":"2015-12-01"}],"value_creation":[1000,1000,1000,1000],"orderbook":[10000,10000,10000,10000],"overrun":[5,5,5,5],"business_days":[22,22,21,21],"fte":[10,10,10,10],"bench":[2,2,2,2],"ext_fte":[1.0,1.0,1.0,1.0],"name":"Test-org-1","expenses_per_fte_month":"4000.00","days_per_week":5,"hours_per_day":"7.50","target_hourly_rate":"10.00","country":"FI","holiday_calendar":1,"site":1},{"id":5,"months":[{"September":"2015-09-01"},{"October":"2015-10-01"},{"November":"2015-11-01"},{"December":"2015-12-01"}],"value_creation":[2000,2000,2000,2000],"orderbook":[20000,20000,20000,20000],"overrun":[10,10,10,10],"business_days":[22,22,21,21],"fte":[20,20,20,20],"bench":[3,3,3,3],"ext_fte":[2.0,2.0,2.0,2.0],"name":"Test-org-2","expenses_per_fte_month":"4000.00","days_per_week":5,"hours_per_day":"8.00","target_hourly_rate":"10.00","country":"DE","holiday_calendar":2,"site":3}]};


function createPowerheadPageObject(vtree) {

	const reportCount = select(".tribe_report")(vtree).length;

	const internals = select(".ints")(vtree)
		.map(el => el.children[1].children[0].text);

	const externals = select(".exts")(vtree)
		.map(el => el.children[1].children[0].text);

	const bench = select(".bench")(vtree)
		.map(el => el.children[1].children[0].text);

	const booked = select(".booked")(vtree)
		.map(el => el.children[1].children[0].text);

	const confirmed_revenue = select(".confirmed_revenue")(vtree)
		.map(el => el.children[2].children[0].text);

	const overruns = select(".overruns")(vtree)
		.map(el => el.children[2].children[0].text);




	return { reportCount, internals, externals, bench, booked, confirmed_revenue, overruns };
}


function mockHTTPDriver() {

	return function handleHTTPRequest(request$) {
		const POWERHEAD_URL = `${API_PATH}/powerhead/`;

		return request$.map(request => {

			return {
				request: request$,
		  		body: []
		  	};
		});
	}
}

describe('PowerheadPageHTTP', () => {

  it('should be a function', () => {
	expect(PowerheadPageHTTP).to.be.a('function');
  });

  it('calling the HTTP should return a request with url', (done) => {
	const props$ = Rx.Observable.just({});
	const HTTPSource = Rx.Observable.empty();
	const {request$, response$} = PowerheadPageHTTP({props$, HTTP: HTTPSource});
	
	request$.subscribe(req => {

		expect(req.url).to.equal('http://localhost:8000/api/v1/powerhead/?range_start=2015-09-01&range_end=2015-09-30');
		done();
	});
  });

  it('should map the responses to body.results', (done) => {
	const props$ = Rx.Observable.just({});
	const HTTPSource = new Rx.ReplaySubject(1);
	const {request$, response$} = PowerheadPageHTTP({props$, HTTP: HTTPSource});
	
	response$.subscribe(response => {
	
		expect(response).to.equal("test");
		done();

	});

	request$.map(req => {
		
		var response$ = Rx.Observable.just({
			request: req,
			body: { results: "test" }
		});
		response$.request = req;
		return response$;

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
      reportLength: 2
    });

  	const HTTPsource$ = new Rx.ReplaySubject(1);

    const DOMSource = mockDOMResponse();

    const powerHeadPage = PowerheadPage({
		DOM: DOMSource, 
		HTTP: HTTPsource$,
		props$
	});

    const request$ = powerHeadPage.HTTP;

	request$.map(request => {
		const mockedResponse$ = Rx.Observable.just({
	  		body: mockData
		});
		mockedResponse$.request = request;
		return mockedResponse$;
	})
	.subscribe(HTTPsource$.asObserver());

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
