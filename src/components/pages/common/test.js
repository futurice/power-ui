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
import select from 'vtree-select';
import _ from 'lodash';
import {LocationFilterWrapper} from './filter-wrappers';

function vtreeToTribeValueList(vtree) {
  return vtree.children.map(el => el.properties.value);
}

describe('LocationFilterWrapper', () => {
  it('should be a function', () => {
    expect(LocationFilterWrapper).to.be.a('function');
  });

  it('should rearrange tribes by tribeOrder', () => {
    const state$ = Rx.Observable.just({
      filters: { location: 'all'},
      tribeOrder: [4,1,2],
      tribes: [{id:1,name:'1'},{id:2,name:'2'},{id:4,name:'4'}],
    });
    var locationFilter = LocationFilterWrapper(state$, mockDOMResponse());

    locationFilter.DOM.last().subscribe(vtree => {
      const rearrangedTribes =  _.without(vtreeToTribeValueList(vtree), 'all', 'FI', 'DE');
      expect(rearrangedTribes).to.eql(['4', '1', '2']);
    });
  });

  it('should add tribes that are not listed in tribeOrder to the end of the array', () => {
    const state$ = Rx.Observable.just({
      filters: { location: 'all'},
      tribeOrder: [2,4,1],
      tribes: [{id:1,name:'1'},{id:2,name:'2'},{id:3,name:'3'},{id:4,name:'4'}],
    });
    var locationFilter = LocationFilterWrapper(state$, mockDOMResponse());

    locationFilter.DOM.last().subscribe(vtree => {
      const rearrangedTribes =  _.without(vtreeToTribeValueList(vtree), 'all', 'FI', 'DE');
      expect(rearrangedTribes).to.eql(['2', '4', '1', '3']);
    });
  });

  it('should ignore items in tribeOrder if there is no tribe with that id', () => {
    const state$ = Rx.Observable.just({
      filters: { location: 'all'},
      tribeOrder: [15,1,4,2,99,102,44],
      tribes: [{id:1,name:'1'},{id:2,name:'2'},{id:4,name:'4'}],
    });
    var locationFilter = LocationFilterWrapper(state$, mockDOMResponse());

    locationFilter.DOM.last().subscribe(vtree => {
      const rearrangedTribes =  _.without(vtreeToTribeValueList(vtree), 'all', 'FI', 'DE');
      expect(rearrangedTribes).length.to.be(3);
      expect(rearrangedTribes).to.eql(['1', '4', '2']);
    });
  });
});
