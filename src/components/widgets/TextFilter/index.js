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
import cuid from 'cuid';
import {ControlledInputHook} from 'power-ui/hooks';
import styles from './styles.scss';

function TextFilter(sources, name = cuid()) {
  const props$ = sources.props$.shareReplay(1);

  const initialValue$ = props$.first().map(props => props.value);

  const dynamicValue$ = sources.DOM
    .select(`.${name}.TextFilter input`)
    .events('input')
    .map(ev => ev.target.value);

  const vtree$ = props$.map(props =>
    <div key={name} className={`${name} TextFilter ${styles.textFilter}`}>
      <p>{props.label}</p>
      <input type="text" placeholder="Add filter"
        data-hook={new ControlledInputHook(props.value)}
        />
    </div>
  );

  const sinks = {
    DOM: vtree$,
    value$: initialValue$.concat(dynamicValue$.debounce(60)),
  };
  return sinks;
}

export default TextFilter;
