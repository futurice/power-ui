/** @jsx hJSX */
import 'babel/polyfill';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from './nav-bar';
import renderDataTable from './data-table';
import locationFilter from './location-filter';
import {URL_ROOT} from '../utils';
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
    .scan((prev, curr) => {
      if (typeof curr === 'function') {
        return curr(prev);
      } else {
        return curr;
      }
    })
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

function peoplePage(sources) {
  const peopleArray$ = sources.HTTP
    .filter(res$ => res$.request === `${URL_ROOT}/people/`)
    .mergeAll()
    .map(responseObj => responseObj.body.results);

  const update$ = makeUpdate$(peopleArray$, sources.props$);
  const state$ = model(update$);

  const tribeFilterProps$ = state$.map(state => {
    return {
      selectedLocation: state.filters.location,
      tribes: state.tribes,
    };
  });
  const tribeFilterSinks = locationFilter({DOM: sources.DOM, props$: tribeFilterProps$});
  const tribeFilterVTree$ = tribeFilterSinks.DOM.replay(null, 1);
  tribeFilterVTree$.connect();
  const filterFn$ = makeFilterFn$(tribeFilterSinks.selectedLocation$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );

  const sinks = {
    DOM: view(filteredState$, tribeFilterVTree$),
    HTTP: Rx.Observable.just(`${URL_ROOT}/people/`),
  };
  return sinks;
}

export default peoplePage;
