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
import {ControlledInputHook} from 'power-ui/hooks';
import {safeCoerceToString} from 'power-ui/utils';
import styles from './styles.scss';
const availabilityFilterStyle = safeCoerceToString(styles.availabilityFilter);

function AvailabilityFilter(sources) {
  const props$ = sources.props$.shareReplay(1);

  const initialValue$ = props$.first().map(({value}) => value);

  const dynamicValue$ = sources.DOM
    .select('.AvailabilityFilter input')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  const valueToReplaceInvalidInput$ = sources.DOM
    .select('.AvailabilityFilter input')
    .events('change')
    .map(ev => ev.target.value)
    .filter(val => isNaN(parseInt(val)) || val.length === 0)
    .map(() => '0');

  const state$ = props$
    .map(({value}) => value)
    .distinctUntilChanged()
    .merge(valueToReplaceInvalidInput$)
    .map(val => String(parseInt(val) || '0'));

  const vtree$ = state$.map(value =>
    <div className={`AvailabilityFilter ${availabilityFilterStyle}`.trim()}>
      <p>Available for</p>
      <input type="num" maxLength="2"
        data-hook={new ControlledInputHook(value)}
        />
      <span>MD</span>
    </div>
  );

  const sinks = {
    DOM: vtree$,
    value$: initialValue$.concat(dynamicValue$.debounce(60)),
  };
  return sinks;
}

export default AvailabilityFilter;
