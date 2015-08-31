/** @jsx hJSX */
import 'babel/polyfill';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from './nav-bar';
import renderDataTable from './data-table';
import locationFilter from './location-filter';
import textFilter from './text-filter';
import {URL_ROOT, smartStateFold} from '../utils';
import _ from 'lodash';
hJSX();

function view(state$, tribeFilterVTree$ = null, textFilterVTree$ = null) {
  return state$.map(state => {
    return (
      <div>
        {renderNavBar()}
        <div className="center-content">
          <div className="content-wrapper">
            <h1>People</h1>
            <div className="filters">
              {tribeFilterVTree$}
              <div className="filtertools bottom-border-line">
                <h3 className="bottom-border-line">Filter tools</h3>
                <div className="textfilter">
                  <p>Find a person or specific skills</p>
                  {textFilterVTree$}
                </div>
              </div>
            </div>
            {renderDataTable(state.people)}
          </div>
        </div>
      </div>
    );
  });
}

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

function makeFilterFn$(selectedLocation$, searchValue$) {
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

  // AND-combine filter functions and compose them (`_.flow`) calling them one
  // after the other.
  return Rx.Observable.combineLatest(locationFilterFn$, searchFilterFn$, _.flow);
}

// Handle all HTTP networking logic of this page
function peoplePageHTTP(sources, urlRoot) {
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
  const locationFilterSinks = locationFilter({
    DOM: sourceDOM,
    props$: locationFilterProps$,
  });

  // Some postprocessing step to handle the location filter's virtual DOM
  const vtree$ = locationFilterSinks.DOM.publishValue(null);
  vtree$.connect();

  return {
    DOM: vtree$,
    selected$: locationFilterSinks.selectedLocation$,
  };
}

function textFilterWrapper(state$, sourceDOM) {
  // Some preprocessing step to make the props from state$
  const textFilterProps$ = state$.take(1).map(state => {
    return {searchString: state.filters.search};
  });
  const sinks = textFilter({DOM: sourceDOM, props$: textFilterProps$});
  return sinks;
}

function peoplePage(sources) {
  const peoplePageHTTPSink = peoplePageHTTP(sources, URL_ROOT);
  const update$ = makeUpdate$(peoplePageHTTPSink.response$, sources.props$);
  const state$ = model(update$);
  const locationFilterSinks = locationFilterWrapper(state$, sources.DOM);
  const textFilterSinks = textFilterWrapper(state$, sources.DOM);
  const filterFn$ = makeFilterFn$(locationFilterSinks.selected$, textFilterSinks.value$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  const vtree$ = view(filteredState$, locationFilterSinks.DOM, textFilterSinks.DOM);

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTPSink.request$,
  };
  return sinks;
}

export default peoplePage;
