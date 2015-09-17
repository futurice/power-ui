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
/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import moment from 'moment';
import styles from './styles.scss';
import {smartStateFold, safeCoerceToString} from 'power-ui/utils';

function intent(DOM) {
  return {
    moveSelected$: Rx.Observable.merge(
      DOM.select('.left').events('click').map(() => -1),
      DOM.select('.right').events('click').map(() => +1)
    ),
  };
}

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

function view(state$) {
  return state$.map(({length, selected}) => {
    const momentLabel = moment().add(selected, 'months').format('YYYY - MMM');
    const monthSelectorClassName = safeCoerceToString(styles.monthSelector);
    const arrowLeftClassName = safeCoerceToString(selected > 0
      ? styles.arrowLeft
      : styles.arrowLeftDisabled
    );
    const arrowRightClassName = safeCoerceToString(selected < length - 1
      ? styles.arrowRight
      : styles.arrowRightDisabled
    );
    return (
      <div className={`MonthSelector ${monthSelectorClassName}`.trim()}>
        <img
          className={`left ${arrowLeftClassName}`.trim()}
          src="img/arrow_icon.svg" />
        <span>{momentLabel}</span>
        <img
          className={`right ${arrowRightClassName}`.trim()}
          src="img/arrow_icon.svg" />
      </div>
    );
  });
}

function MonthSelector(sources) {
  const actions = intent(sources.DOM);
  const state$ = model(sources.props$, actions);
  const vtree$ = view(state$);
  const selected$ = state$.map(({selected}) => selected);

  const sinks = {
    DOM: vtree$,
    value$: selected$,
  };
  return sinks;
}

export default MonthSelector;
