import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';
import TextFilter from 'power-ui/components/widgets/TextFilter/index';
import AvailabilityFilter from 'power-ui/components/widgets/AvailabilityFilter/index';
import PeoplePageHTTP from './http.js';
import {model, filterState} from './model.js';
import view from './view.js';

function LocationFilterWrapper(state$, DOM) {
  // Some preprocessing step to make the props for the location filter
  const props$ = state$
    .map(state => ({location: state.filters.location, tribes: state.tribes}));
  // Call the location filter program
  const locationFilter = LocationFilter({DOM, props$});
  // Some postprocessing step to handle the location filter's virtual DOM
  const vtree$ = locationFilter.DOM.publishValue(null);
  vtree$.connect();
  return {DOM: vtree$, value$: locationFilter.value$};
}

function TextFilterWrapper(state$, DOM) {
  // Some preprocessing step to make the props from state$
  const props$ = state$
    .map(state => ({value: state.filters.search}))
    .distinctUntilChanged(state => state.searchString);
  return TextFilter({DOM, props$});
}

function AvailabilityFilterWrapper(state$, sourceDOM) {
  // Some preprocessing step to make the props from state$
  const props$ = state$
    .map(state => ({value: state.filters.availability}))
    .distinctUntilChanged(state => state.value);
  const sinks = AvailabilityFilter({DOM: sourceDOM, props$});
  return sinks;
}

function PeoplePage(sources) {
  const peoplePageHTTP = PeoplePageHTTP(sources);
  const state$ = model(peoplePageHTTP.response$, sources.props$);
  const locationFilter = LocationFilterWrapper(state$, sources.DOM);
  const textFilter = TextFilterWrapper(state$, sources.DOM);
  const availabilityFilter = AvailabilityFilterWrapper(state$, sources.DOM);
  const filteredState$ = filterState(
    state$,
    locationFilter.value$, textFilter.value$, availabilityFilter.value$
  );
  const vtree$ = view(
    filteredState$,
    locationFilter.DOM, textFilter.DOM, availabilityFilter.DOM
  );

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTP.request$,
  };
  return sinks;
}

export default PeoplePage;
