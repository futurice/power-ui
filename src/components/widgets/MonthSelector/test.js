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
import MonthSelector from './index';

describe('MonthSelector', () => {
  it('should be a function', () => {
    expect(MonthSelector).to.be.a('function');
  });

  it('should output DOM displaying current month initially', (done) => {
    const props$ = Rx.Observable.just({
      length: 6, // months
    });
    const monthSelector = MonthSelector({DOM: mockDOMResponse(), props$});
    monthSelector.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.MonthSelector', [
          h('img.left'),
          h('span', moment().format('YYYY - MMM')),
          h('img.right')
        ])
      );
      done();
    });
  });
});
