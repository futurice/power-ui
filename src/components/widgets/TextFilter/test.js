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
import TextFilter from './index';

describe('TextFilter', () => {
  it('should be a function', () => {
    expect(TextFilter).to.be.a('function');
  });

  it('should output correct string value after input event', done => {
    const props$ = Rx.Observable.just({
      label: 'Find a person or specific skills',
      value: '',
    });
    const componentName = 'hello world';
    const DOMResponse = mockDOMResponse({
      [`.${componentName}.TextFilter input`]: {
        'input': Rx.Observable.just({
          target: {value: 'test value'}
        })
      }
    });
    const textFilter = TextFilter({DOM: DOMResponse, props$}, componentName);
    textFilter.value$.last().subscribe(input => {
      expect(input).to.be.a('string');
      expect(input).to.equal('test value');
      done();
    });
  });
});
