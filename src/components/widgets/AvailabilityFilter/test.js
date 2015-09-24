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
import AvailabilityFilter from './index';

describe('AvailabilityFilter', () => {
  it('should be a function', () => {
    expect(AvailabilityFilter).to.be.a('function');
  });

  it('should apply props value to the <input>', (done) => {
    const props$ = Rx.Observable.just({value: 18});
    const DOMSource = mockDOMResponse();
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.AvailabilityFilter', [
          h('p', 'Available for'),
          h('input', {type: 'num', maxLength: '2'}),
          h('span', 'MD')
        ])
      );
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('18');
      done();
    });
  });

  it('should set <input> to zero if props value was invalid', (done) => {
    const props$ = Rx.Observable.just({value: '!'});
    const DOMSource = mockDOMResponse();
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(0).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.AvailabilityFilter', [
          h('p', 'Available for'),
          h('input', {type: 'num', maxLength: '2'}),
          h('span', 'MD')
        ])
      );
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('0');
      done();
    });
  });

  it('should replace invalid value with zero on <input>', (done) => {
    const props$ = Rx.Observable.just({value: 18});
    const DOMSource = mockDOMResponse({
      '.AvailabilityFilter input': {
        'change': Rx.Observable.just({target: {value: 'x'}}).delay(5),
      },
    });
    const availabilityFilter = AvailabilityFilter({DOM: DOMSource, props$});
    availabilityFilter.DOM.elementAt(1).subscribe(vtree => {
      expect(vtree).to.look.like(
        h('div.AvailabilityFilter', [
          h('p', 'Available for'),
          h('input', {type: 'num', maxLength: '2'}),
          h('span', 'MD')
        ])
      );
      expect(vtree.children[1].properties['data-hook'].injectedText)
        .to.be.equal('0');
      done();
    });
  });
});
