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
import {replicateStream} from 'power-ui/utils';
import makeDataTablePageHTTP from 'power-ui/components/pages/common/data-table-page-http';
import TextFilter from 'power-ui/components/widgets/TextFilter/index';
import AvailabilityFilter from 'power-ui/components/widgets/AvailabilityFilter/index';
import TimeRangeFilter from 'power-ui/components/widgets/TimeRangeFilter/index';
import DataTableWrapper from './data-table-wrapper';
import {model, filterState} from './model';
import view from './view';
import {LocationFilterWrapper} from 'power-ui/components/pages/common/filter-wrappers';

function TextFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      label: 'Find a person or specific skills',
      value: state.filters.search,
    }))
    .distinctUntilChanged(state => state.value);
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

function PeoplePageHTTP(sources) {
  return makeDataTablePageHTTP('/people/')(sources);
}

function intent(textFilterSinks) {
  return {
    setSearchFilter$: textFilterSinks.value$,
  };
}

function PeoplePage(sources) {
  const proxyState$ = new Rx.ReplaySubject(1);
  const peoplePageHTTP = PeoplePageHTTP({HTTP: sources.HTTP, props$: proxyState$});
  const proxyTextFilterSinks = {value$: new Rx.ReplaySubject(1)};
  const actions = intent(proxyTextFilterSinks);
  const state$ = model(peoplePageHTTP.response$, sources.props$, actions);
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
  const localStorageSink$ = locationFilter.value$.map(location => ({location}));
  replicateStream(state$, proxyState$);
  replicateStream(textFilter.value$, proxyTextFilterSinks.value$);

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTP.request$,
    Popup: dataTable.Popup,
    LocalStorage: localStorageSink$,
  };
  return sinks;
}

export default PeoplePage;
