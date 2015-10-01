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
import {expect} from 'chai';
import {h, mockDOMResponse} from '@cycle/dom';
import {Rx} from '@cycle/core';
import TimeRangeFilter from './index';
import moment from "moment";
import _ from 'lodash';

describe('TimeRangeFilter', () => {
  it('should be a function', () => {
    expect(TimeRangeFilter).to.be.a('function');
  });

  it('should apply labels from props value to the <ul>', (done) => {
    var props = {
      availableTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(5, 'months').endOf('month'),
      },
      selectedTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(2, 'months').endOf('month'),
      }
    };

    const timeRangeStart = props.availableTimeRange.start;

    const expectedLabels = _.range(5).map(i => timeRangeStart.clone().add(i, 'months').format('MMM'));
    
    if (props.availableTimeRange.start.format('YY-MM') === moment().format('YY-MM')) {
      expectedLabels[0] = 'Now';
    }
 
    const props$ = Rx.Observable.just(props);
    const DOMSource = mockDOMResponse();
    const timeRangeFilter = TimeRangeFilter({DOM: DOMSource, props$});
    timeRangeFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.TimeRangeFilter', [
          h('p', 'Within this time frame'),
          h('section', [
            h('input', {type: 'range', min: '0', step: '1', max: '4'}),
            h('input', {type: 'range', min: '0', step: '1', max: '4'}),
            h('ul', [
              h('li', expectedLabels[0]),
              h('li', expectedLabels[1]),
              h('li', expectedLabels[2]),
              h('li', expectedLabels[3]),
              h('li', expectedLabels[4]),
            ])
          ])
        ])
      );
      done();
    });
  });

  it('should apply start date from props value to the first <input> slider', (done) => {
    var props = {
     availableTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(5, 'months').endOf('month'),
      },
      selectedTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(2, 'months').endOf('month'),
      }
    };

    const props$ = Rx.Observable.just(props);
    const DOMSource = mockDOMResponse();
    const timeRangeFilter = TimeRangeFilter({DOM: DOMSource, props$});
    timeRangeFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.be.an('object');

      const section = vtree.children[1];
      const input1 = section.children[0]
      const input2 = section.children[1]

      expect(input1.properties['data-hook'].injectedText)
        .to.be.equal(0);

      done();
    });
  });

  it('should apply end date from props value to the second <input> slider', (done) => {
    var props = {
      availableTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(5, 'months').endOf('month'),
      },
      selectedTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(3, 'months').endOf('month'),
      }
    };

    const props$ = Rx.Observable.just(props);
    const DOMSource = mockDOMResponse();
    const timeRangeFilter = TimeRangeFilter({DOM: DOMSource, props$});
    timeRangeFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.be.an('object');

      const section = vtree.children[1];
      const input1 = section.children[0]
      const input2 = section.children[1]

      expect(input2.properties['data-hook'].injectedText)
        .to.be.equal(3);

      done();
    });
  });

  it('should change the selectedTimeRange when slider handles are moved', (done) => {
    var props = {
      availableTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(5, 'months').endOf('month'),
      },
      selectedTimeRange: {
        start: moment([2015,8,1]).startOf("month"),
        end: moment([2015,8,1]).startOf("month").add(3, 'months').endOf('month'),
      }
    };

    const props$ = Rx.Observable.just(props);
    const DOMSource = mockDOMResponse({
       '.TimeRangeFilter input:nth-child(2)': {
        'input': Rx.Observable.just({target: {value: '1'}}),
      },
    });

    const timeRangeFilter = TimeRangeFilter({DOM: DOMSource, props$});
    timeRangeFilter.value$.subscribe(state => {
      expect(state.selectedTimeRange.end.format("YYYY-MM-DD")).to.equal("2015-10-31");
      done();
    });
  });

});
