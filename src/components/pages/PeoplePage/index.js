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
import TextFilter from 'power-ui/components/widgets/TextFilter/index';
import AvailabilityFilter from 'power-ui/components/widgets/AvailabilityFilter/index';
import TimeRangeFilter from 'power-ui/components/widgets/TimeRangeFilter/index';
import DataTable from 'power-ui/components/widgets/DataTable/index';
import PeoplePageHTTP from './http.js';
import {model, filterState, modelAvailableTimeRange} from './model.js';
import view from './view.js';
import {Rx} from '@cycle/core';

function LocationFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({location: state.filters.location, tribes: state.tribes}));
  return LocationFilter({DOM, props$});
}

function TextFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({value: state.filters.search}))
    .distinctUntilChanged(state => state.searchString);
  return TextFilter({DOM, props$});
}

function AvailabilityFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({value: state.filters.availability}))
    .distinctUntilChanged(state => state.value);
  return AvailabilityFilter({DOM, props$});
}

function TimeRangeFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      selectedTimeRange: state.timeRange,
      availableTimeRange: state.availableTimeRange,
    }))
    .distinctUntilChanged(state => state.selectedTimeRange);

  return TimeRangeFilter({DOM, props$});
}

function DataTableWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      people: state.people,
      timeRange: state.timeRange,
      progress: state.progress,
    }));
  return DataTable({DOM, props$});
}

function PeoplePage(sources) {
  const availableTimeRange$ = modelAvailableTimeRange();
  const peoplePageHTTP = PeoplePageHTTP({...sources, availableTimeRange$});
  const state$ = model(peoplePageHTTP.response$, sources.props$);
  const locationFilter = LocationFilterWrapper(state$, sources.DOM);
  const textFilter = TextFilterWrapper(state$, sources.DOM);
  const availabilityFilter = AvailabilityFilterWrapper(state$, sources.DOM);
  const timeRangeFilter = TimeRangeFilterWrapper(state$, sources.DOM);
  const filteredState$ = filterState(state$,
    locationFilter.value$, textFilter.value$,
    availabilityFilter.value$, timeRangeFilter.value$
  );
  const dataTable = DataTableWrapper(filteredState$, sources.DOM);
  const vtree$ = view(
    locationFilter.DOM, textFilter.DOM, availabilityFilter.DOM,
    timeRangeFilter.DOM, dataTable.DOM
  );

  const storageStream$ = Rx.Observable.combineLatest(
    locationFilter.value$, textFilter.value$,
    availabilityFilter.value$,
    (location, text, availability) => {
      return {location, text, availability};
    }
  );

  storageStream$.subscribe(val => console.log('LS writes', val));

  sources.LocalStorage.subscribe(val => console.log('LS reads', val));

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTP.request$,
    LocalStorage: Rx.Observable.just('test' + new Date()),
  };
  return sinks;
}

export default PeoplePage;
