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
import moment from 'moment';
import {smartStateFold} from 'power-ui/utils';

const initialState = {
  dataArray: [],
  progress: 0,
  filtered: [],
  tribes: [],
  timeRange: { // selected time range
    start: moment().startOf('month'),
    end: moment().clone().add(2, 'months').endOf('month'),
  },
  availableTimeRange: {
    start: moment().startOf('month'),
    end: moment().clone().add(5, 'months').endOf('month'),
  },
  filters: {
    location: 'all',
    search: '',
    availability: null,
  },
};

function makeUpdateFn$(dataArray$, props$, actions) {
  const updateDataArray$ = dataArray$
    .map(({dataArray, progress}) => function updateStateWithDataArray(oldState) {
      return {...oldState, dataArray: dataArray, progress};
    });

  const updateStateWithProps$ = props$
    .map(props => function updateStateWithProps(oldState) {
      return {
        ...oldState,
        tribes: props.tribes || oldState.tribes,
        availableTimeRange: props.availableTimeRange || oldState.availableTimeRange,
        filters: {
          ...oldState.filters,
          location: props.location || oldState.filters.location,
        },
      };
    });

  const updateSearchFilter$ = actions.setSearchFilter$
    .map(search => function updateStateWithSearchFilter(oldState) {
      return {...oldState, filters: {...oldState.filters, search}};
    });

  return Rx.Observable.merge(
    updateDataArray$,
    updateStateWithProps$,
    updateSearchFilter$
  );
}

function model(dataArray$, props$, actions) {
  const update$ = makeUpdateFn$(dataArray$, props$, actions);
  const state$ = update$
    .scan(smartStateFold, initialState)
    .shareReplay(1);
  return state$;
}

export default model;
