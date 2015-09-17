import {Rx} from '@cycle/core';
import _ from 'lodash';
import moment from 'moment';
import {smartStateFold} from 'power-ui/utils';

function makeUpdateFn$(peopleData$, props$) {
  const updatePeopleArray$ = peopleData$
    .map(({people, progress}) => function updateStateWithPeopleArray(oldState) {
      return {...oldState, people: people, progress: progress};
    });

  const updateTribes$ = props$
    .map(tribes => function updateStateWithTribes(oldState) {
      return {...oldState, tribes};
    });

  return Rx.Observable.merge(updatePeopleArray$, updateTribes$);
}

const initialState = {
  people: [],
  progress: 0,
  filtered: [],
  tribes: [],
  timeRange: {
    start: moment().startOf('month'),
    end: moment().clone().add(5, 'months').endOf('month'),
  },
  filters: {
    location: 'all',
    search: null,
    availability: null,
    timeRange: {
      start: moment().startOf('month'),
      end: moment().clone().add(5, 'months').endOf('month'),
    },
  },
};

function model(peopleData$, props$) {
  const update$ = makeUpdateFn$(peopleData$, props$);
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

function makeFilterByAvailabilityFn$(availabilityValue$) {
  return makeFilterFn$(availabilityValue$, availabilityValue =>
    function filterStateBySearch(person) {
      const man_days_available = parseInt(person.man_days_available);
      return (
        availabilityValue === null
        || man_days_available >= availabilityValue
      );
    }
  );
}

/*
function makeFilterByAvailabilityAndTimeRangeFn$(availabilityValue$, timeRange$) {
  return Rx.Observable.combineLatest(availabilityValue$, timeRange$,
    (availabilityValue, timeRange) => {
      return function filterStateByAvailabilityAndTimeRange(oldState) {
        const newPeople = oldState.people.map(person => {
          // calculate man_days_available on given timeRange
          console.log(timeRange);

          return person;
        }).filter(person => {
          console.log(person);

          // keep people who have man_days_available >= availabilityvalue
          return true;
        }).map(person => {
          // remove cases/allocs that are not on the time range
          return person;
        });

        return {...oldState, people: newPeople};
      };
    });
}
*/

function makeTimeRangeFilterFn$(timeRange$) {
  return timeRange$.map(timeRange => {
    return function filterStateByTimeRange(oldState) {
     
      return {...oldState, timeRange: timeRange.range};
    };
  });
}

function makeCombinedFilterFn$(location$, searchValue$, availability$, timeRange$) {
  const locationFilterFn$ = makeFilterByLocationFn$(location$);
  const searchFilterFn$ = makeFilterBySearchFn$(searchValue$);

  const availabilityFilterFn$ = makeFilterByAvailabilityFn$(availability$);
  const timeRangeFilterFn$ = makeTimeRangeFilterFn$(timeRange$);

 /* const availabilityAndTimeRangeFilterFn$
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
