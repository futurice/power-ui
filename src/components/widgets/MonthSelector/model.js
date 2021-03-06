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
import {Rx} from '@cycle/core';
import {smartStateFold} from 'power-ui/utils';

const initialState = {
  length: 1,
  selected: 0,
};

function makeUpdateFn$(props$, moveSelected$) {
  const updateLengthFn$ = props$
    .map(({length}) => function moveSelectedFn(oldState) {
      return {...oldState, length};
    });

  const updateSelectedFn$ = moveSelected$
    .map(delta => function moveSelectedFn(oldState) {
      let newSelected = oldState.selected + delta;
      if (newSelected < 0) {
        newSelected = 0;
      }
      if (newSelected >= oldState.length) {
        newSelected = oldState.length - 1;
      }
      return {...oldState, selected: newSelected};
    });

  return Rx.Observable.merge(updateLengthFn$, updateSelectedFn$);
}

function model(props$, actions) {
  const updateFn$ = makeUpdateFn$(props$, actions.moveSelected$);
  const state$ = updateFn$
    .startWith(initialState)
    .scan(smartStateFold)
    .shareReplay(1);
  return state$;
}

export default model;
