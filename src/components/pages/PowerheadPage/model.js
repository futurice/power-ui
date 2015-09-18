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
import _ from 'lodash';
import {smartStateFold} from 'power-ui/utils';

const initialState = {
  reports: [],
  tribes: [],
  // How many months are included in a report:
  reportLength: 0,
  // How many months beyond the current month can we see a report:
  lookaheadLength: 0,
  filters: {
    location: 'all',
  },
};

function makeUpdateFn$(powerheadData$, props$) {
  const updatePowerheadReports$ = powerheadData$
    .map(reports => function updateStateWithPeopleArray(oldState) {
      return {...oldState, reports};
    });

  const updateTribes$ = props$
    .map(props => function updateStateWithTribes(oldState) {
      return {...oldState, ...props};
    });

  return Rx.Observable.merge(updatePowerheadReports$, updateTribes$);
}

function model(powerheadData$, props$) {
  const update$ = makeUpdateFn$(powerheadData$, props$);
  const state$ = update$
    .startWith(initialState)
    .scan(smartStateFold)
    .shareReplay(1);
  return state$;
}

function makeFilterByLocationFn$(selectedLocation$) {
  return selectedLocation$
    .map(location => function filterStateByLocation(oldState) {
      const newReports = oldState.reports.filter(report =>
        location === 'all'
        || location === report.name
        || location === report.country
        || location === report.site
      );
      return {...oldState, reports: newReports};
    })
    .startWith(_.identity); // identity means "allow anything"
}

function makeFilterByCurrentMonthFn$(monthIndex$) {
  return monthIndex$
    .map(monthIndex => function filterStateByCurrentMonth(oldState) {
      const sliceArray = (arr) =>
        arr.slice(monthIndex, monthIndex + oldState.reportLength);
      const newReports = oldState.reports.map(report => {
        return {
          ...report,
          months: sliceArray(report.months),
          value_creation: sliceArray(report.value_creation),
          overrun: sliceArray(report.overrun),
          business_days: sliceArray(report.business_days),
          fte: sliceArray(report.fte),
          bench: sliceArray(report.bench),
          ext_fte: sliceArray(report.ext_fte),
        };
      });
      return {...oldState, reports: newReports};
    })
    .startWith(_.identity); // identity means "allow anything"
}

function makeCombinedFilterFn$(monthIndex$, location$) {
  const locationFilterFn$ = makeFilterByLocationFn$(location$);
  const monthFilterFn$ = makeFilterByCurrentMonthFn$(monthIndex$);

  // AND-combine filter functions and compose them (`_.flow`)
  // calling them one after the other.
  return Rx.Observable.combineLatest(locationFilterFn$, monthFilterFn$, _.flow);
}

function filterState(state$, monthIndex$, location$) {
  const filterFn$ = makeCombinedFilterFn$(monthIndex$, location$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  return filteredState$;
}

export default {model, filterState};
