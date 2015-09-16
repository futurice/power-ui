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
import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';
import PowerheadPageHTTP from './http.js';
import {model, filterState, modelTimeRange} from './model';
import view from './view';

function LocationFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({location: state.filters.location, tribes: state.tribes}));
  return LocationFilter({DOM, props$});
}

function PowerheadPage(sources) {
  const timeRange$ = modelTimeRange();
  const powerheadPageHTTP = PowerheadPageHTTP({HTTP: sources.HTTP, timeRange$});
  const state$ = model(powerheadPageHTTP.response$, sources.props$);
  const locationFilter = LocationFilterWrapper(state$, sources.DOM);
  const filteredState$ = filterState(state$, locationFilter.value$);
  const vtree$ = view(filteredState$, locationFilter.DOM);

  const sinks = {
    DOM: vtree$,
    HTTP: powerheadPageHTTP.request$,
  };
  return sinks;
}

export default PowerheadPage;
