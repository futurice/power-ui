import {Rx} from '@cycle/core';
import _ from 'lodash';
import moment from 'moment';
import {smartStateFold} from 'power-ui/utils';

function makeUpdateFn$(peopleArray$, props$) {
  const updatePeopleArray$ = peopleArray$
    .map(peopleArray => function updateStateWithPeopleArray(oldState) {
      return {...oldState, people: peopleArray};
    });

  const updateTribes$ = props$
    .map(tribes => function updateStateWithTribes(oldState) {
      return {...oldState, tribes};
    });

  return Rx.Observable.merge(updatePeopleArray$, updateTribes$);
}

const initialState = {
  people: [],
  filtered: [],
  tribes: [],
  timeFrame: {
    start: moment().startOf('month'),
    end: moment().add(2, 'months').startOf('month'),
  },
  filters: {
    location: 'all',
    search: null,
    availability: null,
  },
};

function model(peopleArray$, props$) {
  const update$ = makeUpdateFn$(peopleArray$, props$);
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

function makeCombinedFilterFn$(location$, searchValue$, availability$) {
  const locationFilterFn$ = makeFilterByLocationFn$(location$);
  const searchFilterFn$ = makeFilterBySearchFn$(searchValue$);
  const availabilityFilterFn$ = makeFilterByAvailabilityFn$(availability$);

  // AND-combine filter functions and compose them (`_.flow`)
  // calling them one after the other.
  return Rx.Observable.combineLatest(
    locationFilterFn$, searchFilterFn$, availabilityFilterFn$,
    _.flow
  );
}

function filterState(state$, location$, search$, availability$) {
  const filterFn$ = makeCombinedFilterFn$(location$, search$, availability$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  return filteredState$;
}

export default {model, filterState};
