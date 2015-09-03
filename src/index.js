import {run, Rx} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import PeoplePage from 'power-ui/components/pages/PeoplePage/index';
import {URL_ROOT} from 'power-ui/utils';

function mainHTTPResponse(HTTPSource) {
  const tribesState$ = HTTPSource
    .filter(res$ => res$.request === `${URL_ROOT}/tribes/`)
    .mergeAll()
    .map(res => res.body.results)
    .startWith([]);
  return tribesState$;
}

function mainHTTPRequest(peoplePageHTTPRequest$) {
  const initialTribeRequest$ = Rx.Observable.just(`${URL_ROOT}/tribes/`);
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
  DOM: makeDOMDriver('.app-container'),
  HTTP: makeHTTPDriver({autoSubscribe: true}),
});
