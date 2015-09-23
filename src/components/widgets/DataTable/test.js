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
import moment from 'moment';
import {Rx} from '@cycle/core';
import {h, mockDOMResponse} from '@cycle/dom';
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
      defaultSortCriteria: '-',
    });
    const DOMSource = mockDOMResponse();
    const dataTable = DataTable({DOM: DOMSource, props$}, 'dataTable');
    dataTable.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.dataTable', [
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

  it('should output "empty" overlay when data has loaded but is empty', (done) => {
    const props$ = Rx.Observable.just({
      people: [],
      progress: 1,
      timeRange: {
        start: moment().startOf('month'),
        end: moment().clone().add(2, 'months').endOf('month'),
      },
      defaultSortCriteria: '-',
      emptyTitle: 'Empty',
    });
    const DOMSource = mockDOMResponse();
    const dataTable = DataTable({DOM: DOMSource, props$}, 'dataTable');
    dataTable.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('section', [
          h('div.dataTable', [
            h('table')
          ]),
          h('div', [
            h('h1', 'Empty'),
            h('h4')
          ])
        ])
      );
      done();
    });
  });
});
