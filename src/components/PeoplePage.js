/** @jsx hJSX */
import 'babel/polyfill';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from './nav-bar';
import renderDataTable from './data-table';
import LocationFilter from './LocationFilter';
import TextFilter from './TextFilter';
import AvailabilityFilter from './AvailabilityFilter';
import {URL_ROOT, smartStateFold} from '../utils';
import _ from 'lodash';
hJSX();

function makeUpdate$(peopleArray$, props$) {
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

function model(update$) {
  const state$ = update$
    .startWith({
      people: [],
      filtered: [],
      tribes: [],
      filters: {
        location: 'all',
        search: null,
        availability: null,
      },
    })
    .scan(smartStateFold)
    .shareReplay(1);
  return state$;
}

function makeFilterFn$(selectedLocation$, searchValue$, availabilityValue$) {
  const locationFilterFn$ = selectedLocation$.map(location =>
    function filterStateByLocation(oldState) {
      const newPeople = oldState.people.filter(person =>
        location === 'all'
        || location === person.tribe.name
        || location === person.tribe.country
        || location === person.tribe.site.name
      );
      return {...oldState, people: newPeople};
    }
  ).startWith(_.identity); // identity means "allow anything"

  const searchFilterFn$ = searchValue$.map(searchValue =>
    function filterStateBySearch(oldState) {
      const newPeople = oldState.people.filter(person => {
        const lowerCaseSearch = searchValue.toLowerCase();
        return (
          lowerCaseSearch === null
          || lowerCaseSearch.length === 0
          || person.name.toLowerCase().indexOf(lowerCaseSearch) !== -1
          || person.skills.toLowerCase().indexOf(lowerCaseSearch) !== -1
        );
      });
      return {...oldState, people: newPeople};
    }
  ).startWith(_.identity);

  const availabilityFilterFn$ = availabilityValue$.map(availabilityValue =>
    function filterStateByAvailability(oldState) {
      const newPeople = oldState.people.filter(person => {
        const man_days_available = parseInt(person.man_days_available);
        return (
          availabilityValue === null
          || man_days_available >= availabilityValue
        );
      });
      return {...oldState, people: newPeople};
    }
  ).startWith(_.identity);

  // AND-combine filter functions and compose them (`_.flow`) calling them one
  // after the other.
  return Rx.Observable.combineLatest(
    locationFilterFn$, searchFilterFn$, availabilityFilterFn$,
    _.flow
  );
}

function view(state$, locationFilterVTree$ = null, textFilterVTree$ = null,
              availabilityFilterVTree$ = null) {
  return state$.map(state => {
    return (
      <div>
        {renderNavBar()}
        <div className="center-content">
          <div className="content-wrapper">
            <h1>People</h1>
            <div className="filters">
              {locationFilterVTree$}
              <div className="filtertools bottom-border-line">
                <h3 className="bottom-border-line">Filter tools</h3>
                <div className="text-filter-container">
                  <p>Find a person or specific skills</p>
                  {textFilterVTree$}
                </div>
                {availabilityFilterVTree$}
              </div>
            </div>
            {renderDataTable(state.people)}
          </div>
        </div>
      </div>
    );
  });
}

// Handle all HTTP networking logic of this page
function PeoplePageHTTP(sources, urlRoot) {
  const request$ = Rx.Observable.just(`${urlRoot}/people/`);
  const response$ = sources.HTTP
    .filter(res$ => res$.request === `${urlRoot}/people/`)
    .mergeAll()
    .map(responseObj => responseObj.body.results);
  const sink = {
    request$,
    response$,
  };
  return sink;
}

function locationFilterWrapper(state$, sourceDOM) {
  // Some preprocessing step to make the props for the location filter
  const locationFilterProps$ = state$.map(state => {
    return {
      selectedLocation: state.filters.location,
      tribes: state.tribes,
    };
  });

  // Call the location filter program
  const locationFilter = LocationFilter({
    DOM: sourceDOM,
    props$: locationFilterProps$,
  });

  // Some postprocessing step to handle the location filter's virtual DOM
  const vtree$ = locationFilter.DOM.publishValue(null);
  vtree$.connect();

  return {
    DOM: vtree$,
    selected$: locationFilter.selectedLocation$,
  };
}

function textFilterWrapper(state$, sourceDOM) {
  // Some preprocessing step to make the props from state$
  const props$ = state$
    .map(state => ({value: state.filters.search}))
    .distinctUntilChanged(state => state.searchString);
  const sinks = TextFilter({DOM: sourceDOM, props$});
  return sinks;
}

function availabilityFilterWrapper(state$, sourceDOM) {
  // Some preprocessing step to make the props from state$
  const props$ = state$
    .map(state => ({value: state.filters.availability}))
    .distinctUntilChanged(state => state.value);
  const sinks = AvailabilityFilter({DOM: sourceDOM, props$});
  return sinks;
}

function PeoplePage(sources) {
  const peoplePageHTTP = PeoplePageHTTP(sources, URL_ROOT);
  const update$ = makeUpdate$(peoplePageHTTP.response$, sources.props$);
  const state$ = model(update$);
  const locationFilter = locationFilterWrapper(state$, sources.DOM);
  const textFilter = textFilterWrapper(state$, sources.DOM);
  const availabilityFilter = availabilityFilterWrapper(state$, sources.DOM);
  const filterFn$ = makeFilterFn$(
    locationFilter.selected$,
    textFilter.value$,
    availabilityFilter.value$
  );
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  const vtree$ = view(
    filteredState$,
    locationFilter.DOM,
    textFilter.DOM,
    availabilityFilter.DOM
  );

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTP.request$,
  };
  return sinks;
}

export default PeoplePage;
