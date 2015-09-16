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
import buttonStyles from './locationFilterButton.scss';

function intent(DOM) {
  return {
    selectLocation$: DOM.select('.LocationFilter button').events('click')
      .map(clickEv => clickEv.target.value),
  };
}

function makeUpdate$(selectLocation$) {
  return selectLocation$
    .startWith('all')
    .map(location => function updateLocation(oldState) {
      return {...oldState, location};
    });
}

function model(props$, update$) {
  return props$.combineLatest(update$, (props, updateFn) => updateFn(props));
}

function renderFilterButton(selectedLocation, label, value = label) {
  const className = selectedLocation === value
    ? buttonStyles.active
    : buttonStyles.normal;
  return (
    <button value={value} className={className}>{label}</button>
  );
}

function renderFilterButtonsForTribes(selectedLocation, tribes) {
  return tribes.map(tribe =>
    renderFilterButton(selectedLocation, tribe.name)
  );
}

function view(state$) {
  return state$.map(state => {
    return (
      <div className="LocationFilter">
        {renderFilterButton(state.location, 'Show all', 'all')}
        {renderFilterButton(state.location, 'Helsinki')}
        {renderFilterButton(state.location, 'Germany', 'DE')}
        {renderFilterButtonsForTribes(state.location, state.tribes)}
      </div>
    );
  }).startWith(
    <div>Loading...</div>
  );
}

function LocationFilter(sources) {
  const actions = intent(sources.DOM);
  const update$ = makeUpdate$(actions.selectLocation$);
  const state$ = model(sources.props$, update$);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$,
    value$: actions.selectLocation$,
  };
  return sinks;
}

export default LocationFilter;
