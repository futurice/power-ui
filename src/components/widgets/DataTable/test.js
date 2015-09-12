/* global describe, it */
import chai from 'chai';
const expect = chai.expect;
chai.use(require('chai-virtual-dom'));
import moment from 'moment';
import mockDOMSource from 'power-ui/test-utils/mock-dom-source';
import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import DataTable from './index';

describe('DataTable', () => {
  it('should be a function', () => {
    expect(DataTable).to.be.a('function');
  });

  it('should output DOM which looks like a basic data table', (done) => {
    const props$ = Rx.Observable.just({
      people: [],
      progress: 0,
      timeRange: {
        start: moment().startOf('month'),
        end: moment().clone().add(2, 'months').endOf('month'),
      },
    });
    const DOMSource = mockDOMSource();
    const dataTable = DataTable({DOM: DOMSource, props$});
    dataTable.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div', [
          h('table', [
            h('thead', [
              h('tr')
            ]),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
            h('tr'),
          ])
        ])
      );
      done();
    });
  });

  it('should output "nobody" overlay when data has loaded but is empty', (done) => {
    const props$ = Rx.Observable.just({
      people: [],
      progress: 1,
      timeRange: {
        start: moment().startOf('month'),
        end: moment().clone().add(2, 'months').endOf('month'),
      },
    });
    const DOMSource = mockDOMSource();
    const dataTable = DataTable({DOM: DOMSource, props$});
    dataTable.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('section', [
          h('div', [
            h('table')
          ]),
          h('div', [
            h('h1', 'Nobody'),
            h('h4')
          ])
        ])
      );
      done();
    });
  });
});
