/** @jsx hJSX */
import 'babel/polyfill';
import {run, Rx} from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import peoplePage from './components/people-page';
import {URL_ROOT} from './utils';

hJSX();

function main(sources) {
  const tribesState$ = sources.HTTP
    .filter(res$ => res$.request === `${URL_ROOT}/tribes/`)
    .mergeAll()
    .map(res => res.body.results)
    .startWith([]);

  const initialTribeRequest$ = Rx.Observable.just(`${URL_ROOT}/tribes/`);
  const peoplePageSinks = peoplePage({...sources, props$: tribesState$});

  const request$ = Rx.Observable.merge(
    initialTribeRequest$,
    peoplePageSinks.HTTP
  );

  const sinks = {
    DOM: Rx.Observable.just(peoplePageSinks.DOM),
    HTTP: request$,
  };
  return sinks;
}

run(main, {
  DOM: makeDOMDriver('.app-container'),
  HTTP: makeHTTPDriver({autoSubscribe: true}),
});
