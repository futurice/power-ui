/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from 'power-ui/components/widgets/nav-bar';
import renderDataTable from 'power-ui/components/widgets/data-table';
import LocationFilter from 'power-ui/components/widgets/LocationFilter';
import TextFilter from 'power-ui/components/widgets/TextFilter';
import AvailabilityFilter from 'power-ui/components/widgets/AvailabilityFilter';
import {URL_ROOT, smartStateFold} from 'power-ui/utils';
import {contentWrapperStyle, borderBottomLineStyle} from 'power-ui/styles/common';
import spacing from 'power-ui/styles/spacing';
import palette from 'power-ui/styles/palette';
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

// Handle all HTTP networking logic of this page
function PeoplePageHTTP(sources, urlRoot) {
  const PEOPLE_URL = `${urlRoot}/people/`;
  const atomicResponse$ = sources.HTTP
    .filter(res$ => _.startsWith(res$.request, PEOPLE_URL))
    .mergeAll()
    .shareReplay(1);
  const request$ = atomicResponse$
    .filter(responseObj => responseObj.body.next)
    .map(responseObj => responseObj.body.next.replace('limit=5', 'limit=40'))
    .startWith(PEOPLE_URL + '?limit=5');
  const arrayOfPeople$ = atomicResponse$
    .map(responseObj => responseObj.body.results)
    .scan((acc, curr) => acc.concat(curr));
  const response$ = arrayOfPeople$;
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

const filtersContainerStyle = {
  'font-weight': 'bold',
};

function renderVerticalFilterSeparator() {
  const style = {
    'display': 'inline-block',
    'width': '1px',
    'background-color': palette.grayLight,
    'margin': `0 ${spacing.normal}`,
  };
  return (
    <div style={style}/>
  );
}

const filtersListStyle = {
  'display': 'flex',
  'flex-direction': 'row',
  'flex-wrap': 'wrap',
  'align-items': 'stretch',
  'padding': `${spacing.small} 0`,
};

function view(state$, locationFilterVTree$ = null, textFilterVTree$ = null,
              availabilityFilterVTree$ = null) {
  return state$.map(state => {
    return (
      <div>
        {renderNavBar()}
        <div style={contentWrapperStyle}>
          <h1>People</h1>
          <div style={filtersContainerStyle}>
            {locationFilterVTree$}
            <div style={borderBottomLineStyle}>
              <h3 style={borderBottomLineStyle}>Filter tools</h3>
              <div style={filtersListStyle}>
                {textFilterVTree$}
                {renderVerticalFilterSeparator()}
                {availabilityFilterVTree$}
              </div>
            </div>
          </div>
        </div>
        {renderDataTable(state.people)}
      </div>
    );
  });
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
