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
import {Rx} from '@cycle/core';
import {h, mockDOMResponse} from '@cycle/dom';
import LocationFilter from './index';

describe('LocationFilter', () => {
  it('should be a function', () => {
    expect(LocationFilter).to.be.a('function');
  });

  it('should display loading DOM when given no props', (done) => {
    const props$ = Rx.Observable.empty();
    const DOMSource = mockDOMResponse();
    const locationFilter = LocationFilter({DOM: DOMSource, props$}, 'test');
    locationFilter.DOM.last().subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.test.LocationFilter', [
          h('button', 'Show all'),
          h('button', 'Finland'),
          h('button', 'Germany')
        ])
      );
      done();
    });
  });

  it('should display default locations when given empty props', (done) => {
    const props$ = Rx.Observable.just({location: null, tribes: []});
    const DOMSource = mockDOMResponse();
    const locationFilter = LocationFilter({DOM: DOMSource, props$}, 'test');
    locationFilter.DOM.last().subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.test.LocationFilter', [
          h('button', 'Show all'),
          h('button', 'Finland'),
          h('button', 'Germany')
        ])
      );
      done();
    });
  });

  it('should display more locations when given props with tribes', (done) => {
    const props$ = Rx.Observable.just({location: null, tribes: [
      {name: 'Patagonia'},
      {name: 'Atlantis'},
    ]});
    const DOMSource = mockDOMResponse();
    const locationFilter = LocationFilter({DOM: DOMSource, props$}, 'test');
    locationFilter.DOM.last().subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.test.LocationFilter', [
          h('button', 'Show all'),
          h('button', 'Finland'),
          h('button', 'Germany'),
          h('button', 'Patagonia'),
          h('button', 'Atlantis')
        ])
      );
      done();
    });
  });
});
