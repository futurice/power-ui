/* global describe, it */
import {expect} from 'chai';
import {mockDOMResponse} from '@cycle/dom';
import {Rx} from '@cycle/core';
import TimeRangeFilter from './index';
import moment from "moment";

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

    const props$ = Rx.Observable.just(props);
    const DOMSource = mockDOMResponse();
    const timeRangeFilter = TimeRangeFilter({DOM: DOMSource, props$});
    timeRangeFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.be.an('object');

      expect(vtree.children).to.be.an('array');
      expect(vtree.children[1]).to.be.an('object');
      expect(vtree.children[1].tagName).to.be.equal('SECTION');

      const section = vtree.children[1];
      const input1 = section.children[0]
      const input2 = section.children[1]
      const ul = section.children[2]

      expect(ul.children
        .filter(vn => vn.children.length > 0)
        .map(vn => vn.children[0].text)
      ).to.eql(["Sep", "Oct", "Nov", "Dec", "Jan"]);


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
