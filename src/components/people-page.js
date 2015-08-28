/** @jsx hJSX */
import 'babel/polyfill';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from './nav-bar';
import renderDataTable from './data-table';
import locationFilter from './location-filter';
import {URL_ROOT, smartStateFold} from '../utils';
hJSX();

function view(state$, tribeFilterVTree$ = null) {
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
                  <p> Find a person or specific skills </p>
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

function makeFilterFn$(selectedLocation$) {
  return selectedLocation$.map(location =>
    function filterStateByLocation(oldState) {
      const newPeople = oldState.people.filter(person =>
        location === 'all'
        || location === person.tribe.name
        || location === person.tribe.country
        || location === person.tribe.site.name
      );
      return {
        ...oldState,
        people: newPeople,
      };
    }
  )
  .startWith(x => x);
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
    vtree$,
    selected$: locationFilterSinks.selectedLocation$,
  };
}

function peoplePage(sources) {
  const peoplePageHTTPSink = peoplePageHTTP(sources, URL_ROOT);
  const update$ = makeUpdate$(peoplePageHTTPSink.response$, sources.props$);
  const state$ = model(update$);
  const locationFilterSinks = locationFilterWrapper(state$, sources.DOM);
  const filterFn$ = makeFilterFn$(locationFilterSinks.selected$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  const vtree$ = view(filteredState$, locationFilterSinks.vtree$);

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTPSink.request$,
  };
  return sinks;
}

export default peoplePage;
