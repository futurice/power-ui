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
import dtModel from 'power-ui/components/pages/common/data-table-page-model';

function model(...args) {
  return dtModel(...args)
    .map(state => ({...state, people: state.dataArray}));
}

/**
 * Returns an Observable of filter functions, built from the value$ using
 * a criteria function built with criteriaFnFactory.
 * criteriaFnFactory :: value -> person -> Boolean
 */
function makeFilterFn$(value$, criteriaFnFactory) {
  return value$
    .map(value => {
      const criteriaFn = criteriaFnFactory(value);
      return function filterStateByCriteria(oldState) {
        const newPeople = oldState.people.filter(criteriaFn);
        return {...oldState, people: newPeople};
      };
    })
    .startWith(_.identity); // identity means "allow anything"
}

function makeFilterByLocationFn$(selectedLocation$, locationsToHideFromAll = []) {
  return makeFilterFn$(selectedLocation$, location =>
    function filterStateByLocation(person) {
      return (
        (location === 'all'
          && !_.includes(locationsToHideFromAll, _.get(person, 'tribe.name'))
        )
        || location === _.get(person, 'tribe.name')
        || location === _.get(person, 'tribe.country')
        || location === _.get(person, 'tribe.site.name')
      );
    }
  );
}

function makeFilterBySearchFn$(searchValue$) {
  return makeFilterFn$(searchValue$, searchValue =>
    function filterStateBySearch(person) {
      const lowerCaseSearch = (searchValue || '').toLowerCase();
      return (
        lowerCaseSearch.length === 0
        || person.name.toLowerCase().indexOf(lowerCaseSearch) !== -1
        || person.skills.toLowerCase().indexOf(lowerCaseSearch) !== -1
      );
    }
  );
}

function makeFilterByAvailabilityFn$(availabilityValue$) {
  return makeFilterFn$(availabilityValue$, availabilityValue =>
    function filterStateByAvailability(person) {
      const man_days_available = parseInt(person.man_days_available);
      return (
        availabilityValue === null
        || man_days_available >= availabilityValue
      );
    }
  );
}

function makeTimeRangeFilterFn$(timeRange$) {
  return timeRange$.map(timeRange => {
    return function filterStateByTimeRange(oldState) {
      return {...oldState, timeRange: timeRange.selectedTimeRange};
    };
  });
}

function makeCombinedFilterFn$(location$, searchValue$, availability$, timeRange$) {
  const locationFilterFn$ = makeFilterByLocationFn$(location$, ['Admin']);
  const searchFilterFn$ = makeFilterBySearchFn$(searchValue$);

  const availabilityFilterFn$ = makeFilterByAvailabilityFn$(availability$);
  const timeRangeFilterFn$ = makeTimeRangeFilterFn$(timeRange$);

 /*
  AvailabilityFilter and TimeRangeFilter should be combined after the
  backend has been updated to support availability calculations on a
  given time range.

 const availabilityAndTimeRangeFilterFn$
    = makeFilterByAvailabilityAndTimeRangeFn$(availability$, timeRange$);
*/

  // AND-combine filter functions and compose them (`_.flow`)
  // calling them one after the other.
  return Rx.Observable.combineLatest(
    locationFilterFn$, searchFilterFn$, availabilityFilterFn$, timeRangeFilterFn$,
    _.flow
  );
}

function filterState(state$, location$, search$, availability$, timeRange$) {
  const filterFn$ = makeCombinedFilterFn$(location$, search$, availability$, timeRange$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  return filteredState$;
}

export default {model, filterState};
