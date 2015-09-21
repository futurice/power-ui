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
import intent from './intent';
import model from './model';
import view from './view';

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
