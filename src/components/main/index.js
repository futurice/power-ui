import PeoplePage from 'power-ui/components/pages/PeoplePage/index';
import PowerheadPage from 'power-ui/components/pages/PowerheadPage/index';
import {mainHTTPRequest, mainHTTPResponse} from './http';
import view from './view';

function main(sources) {
  const tribesState$ = mainHTTPResponse(sources.HTTP);
  const peoplePage = PeoplePage({...sources, props$: tribesState$});
  const powerheadPage = PowerheadPage({...sources, props$: tribesState$});
  const request$ = mainHTTPRequest(peoplePage.HTTP, powerheadPage.HTTP);
  const vtree$ = view(sources.Route, peoplePage.DOM, powerheadPage.DOM);

  const sinks = {
    DOM: vtree$,
    HTTP: request$,
  };
  return sinks;
}

export default main;
