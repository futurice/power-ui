import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';
import TextFilter from 'power-ui/components/widgets/TextFilter/index';
import AvailabilityFilter from 'power-ui/components/widgets/AvailabilityFilter/index';
import DataTable from 'power-ui/components/widgets/DataTable/index';
import PeoplePageHTTP from './http.js';
import {model, filterState} from './model.js';
import view from './view.js';

function LocationFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({location: state.filters.location, tribes: state.tribes}));
  return LocationFilter({DOM, props$});
}

function TextFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({value: state.filters.search}))
    .distinctUntilChanged(state => state.searchString);
  return TextFilter({DOM, props$});
}

function AvailabilityFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({value: state.filters.availability}))
    .distinctUntilChanged(state => state.value);
  return AvailabilityFilter({DOM, props$});
}

function DataTableWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      people: state.people,
      timeRange: state.timeRange,
      progress: state.progress,
    }));
  return DataTable({DOM, props$});
}

function PeoplePage(sources) {
  const peoplePageHTTP = PeoplePageHTTP(sources);
  const state$ = model(peoplePageHTTP.response$, sources.props$);
  const locationFilter = LocationFilterWrapper(state$, sources.DOM);
  const textFilter = TextFilterWrapper(state$, sources.DOM);
  const availabilityFilter = AvailabilityFilterWrapper(state$, sources.DOM);
  const filteredState$ = filterState(state$,
    locationFilter.value$, textFilter.value$, availabilityFilter.value$
  );
  const dataTable = DataTableWrapper(filteredState$, sources.DOM);
  const vtree$ = view(
    locationFilter.DOM, textFilter.DOM, availabilityFilter.DOM, dataTable.DOM
  );

  const sinks = {
    DOM: vtree$,
    HTTP: peoplePageHTTP.request$,
  };
  return sinks;
}

export default PeoplePage;
