import {run, Rx} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import PeoplePage from 'power-ui/components/pages/PeoplePage/index';
import {API_PATH} from 'power-ui/conf';
import {urlToRequestObjectWithHeaders, isTruthy} from 'power-ui/utils';
import 'power-ui/styles/global.scss';

function mainHTTPResponse(HTTPSource) {
  const tribesState$ = HTTPSource
    .filter(response$ => response$.request.url === `${API_PATH}/tribes/`)
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .map(response => response.body.results)
    .startWith([]);
  return tribesState$;
}

function mainHTTPRequest(peoplePageHTTPRequest$) {
  const initialTribeRequest$ = Rx.Observable.just(`${API_PATH}/tribes/`)
    .map(urlToRequestObjectWithHeaders);
  const request$ = Rx.Observable.merge(
    initialTribeRequest$,
    peoplePageHTTPRequest$
  );
  return request$;
}

function main(sources) {
  const tribesState$ = mainHTTPResponse(sources.HTTP);
  const peoplePage = PeoplePage({...sources, props$: tribesState$});
  const request$ = mainHTTPRequest(peoplePage.HTTP);

  const sinks = {
    DOM: peoplePage.DOM,
    HTTP: request$,
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('#power-ui-app-container'),
  HTTP: makeHTTPDriver({autoSubscribe: true}),
});
