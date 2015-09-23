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
      items: [],
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
      items: [],
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

  it('should sort a column when clicking on its header', (done) => {
    const props$ = Rx.Observable.just({
      items: [
        {number: '11', letter: 'c', cases: []},
        {number: '22', letter: 'a', cases: []},
        {number: '33', letter: 'b', cases: []},
      ],
      progress: 1,
      columns: [
        {name: 'number', label: 'Number column', valueFn: x => x.number},
        {name: 'letter', label: 'Letter column', valueFn: x => x.letter},
      ],
      defaultSortCriteria: '-number',
    });

    const DOMSource = mockDOMResponse({
      '.dataTable .sortable-column': {
        'click': Rx.Observable.of(
          {currentTarget: {dataset: {column: 'number'}}},
          {currentTarget: {dataset: {column: 'letter'}}}
        )
      },
    });

    const dataTable = DataTable({DOM: DOMSource, props$}, 'dataTable');

    const expectedTableHeader =
      h('thead', [
        h('tr', [
          h('th', []),
          h('th.sortable-column', {attributes: {'data-column': 'number'}}, [
            h('span', 'Number column')
          ]),
          h('th.sortable-column', {attributes: {'data-column': 'letter'}}, [
            h('span', 'Letter column')
          ])
        ]),
      ]);

    dataTable.DOM.elementAt(0).subscribe(vtree => {
      // Decreasing numbers
      expect(vtree).to.look.like(
        h('div.dataTable', [
          h('table', [
            expectedTableHeader,
            h('tr', [
              h('td', []),
              h('td', ['33']),
              h('td', ['b']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['22']),
              h('td', ['a']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['11']),
              h('td', ['c']),
            ]),
          ])
        ])
      );
    });

    dataTable.DOM.elementAt(1).subscribe(vtree => {
      // Increasing numbers
      expect(vtree).to.look.like(
        h('div.dataTable', [
          h('table', [
            expectedTableHeader,
            h('tr', [
              h('td', []),
              h('td', ['11']),
              h('td', ['c']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['22']),
              h('td', ['a']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['33']),
              h('td', ['b']),
            ]),
          ])
        ])
      );
    });

    dataTable.DOM.elementAt(2).subscribe(vtree => {
      // Increasing letters
      expect(vtree).to.look.like(
        h('div.dataTable', [
          h('table', [
            expectedTableHeader,
            h('tr', [
              h('td', []),
              h('td', ['22']),
              h('td', ['a']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['33']),
              h('td', ['b']),
            ]),
            h('tr', [
              h('td', []),
              h('td', ['11']),
              h('td', ['c']),
            ]),
          ])
        ])
      );
      done();
    });
  });
});
