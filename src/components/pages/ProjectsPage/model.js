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
import moment from 'moment';
import {smartStateFold} from 'power-ui/utils';

const defaultProps$ = Rx.Observable.just({
  availableTimeRange: {
    start: moment().startOf('month'),
    end: moment().clone().add(5, 'months').endOf('month'),
  },
});

function makeUpdateFn$(projectsData$, props$) {
  const updateProjectsArray$ = projectsData$
    .map(({dataArray, progress}) => function updateStateWithPeopleArray(oldState) {
      return {...oldState, projects: dataArray, progress};
    });

  const updateStateWithProps$ = props$.combineLatest(defaultProps$,
      (props, defaultProps) => ({...defaultProps, ...props})
    )
    .map(props => function updateStateWithTribes(oldState) {
      return {...oldState, ...props};
    });

  return Rx.Observable.merge(
    updateProjectsArray$,
    updateStateWithProps$
  );
}

const initialState = {
  projects: [],
  progress: 0,
  filtered: [],
  tribes: [],
  timeRange: { // selected time range
    start: moment().startOf('month'),
    end: moment().clone().add(2, 'months').endOf('month'),
  },
  availableTimeRange: {
    start: null,
    end: null,
  },
  filters: {
    location: 'all',
    search: null,
    availability: null,
  },
};

function model(projectsData$, props$) {
  const update$ = makeUpdateFn$(projectsData$, props$);
  const state$ = update$
    .startWith(initialState)
    .scan(smartStateFold)
    .shareReplay(1);
  return state$;
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

function makeFilterByLocationFn$(selectedLocation$) {
  return makeFilterFn$(selectedLocation$, location =>
    function filterStateByLocation(person) {
      return (
        location === 'all'
        || location === person.tribe.name
        || location === person.tribe.country
        || location === person.tribe.site.name
      );
    }
  );
}

function makeFilterBySearchFn$(searchValue$) {
  return makeFilterFn$(searchValue$, searchValue =>
    function filterStateBySearch(person) {
      const lowerCaseSearch = searchValue.toLowerCase();
      return (
        lowerCaseSearch === null
        || lowerCaseSearch.length === 0
        || person.name.toLowerCase().indexOf(lowerCaseSearch) !== -1
        || person.skills.toLowerCase().indexOf(lowerCaseSearch) !== -1
      );
    }
  );
}

function makeCombinedFilterFn$(location$, searchValue$) {
  const locationFilterFn$ = makeFilterByLocationFn$(location$);
  const searchFilterFn$ = makeFilterBySearchFn$(searchValue$);

  // AND-combine filter functions and compose them (`_.flow`)
  // calling them one after the other.
  return Rx.Observable.combineLatest(locationFilterFn$, searchFilterFn$, _.flow);
}

function filterState(state$, location$, search$) {
  const filterFn$ = makeCombinedFilterFn$(location$, search$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  return filteredState$;
}

export default {model, filterState, defaultProps$};
