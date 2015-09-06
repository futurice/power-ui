import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';
import PowerheadPageHTTP from './http.js';
import {model} from './model';
import view from './view';

function LocationFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({location: state.filters.location, tribes: state.tribes}));
  return LocationFilter({DOM, props$});
}

function PeoplePage(sources) {
  const powerheadPageHTTP = PowerheadPageHTTP(sources);
  const state$ = model(powerheadPageHTTP.response$, sources.props$);
  const locationFilter = LocationFilterWrapper(state$, sources.DOM);
  const vtree$ = view(state$, locationFilter.DOM);

  const sinks = {
    DOM: vtree$,
    HTTP: powerheadPageHTTP.request$,
  };
  return sinks;
}

export default PeoplePage;
