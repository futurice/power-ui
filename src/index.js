import {run} from '@cycle/core';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import {hashRouteDriver} from 'power-ui/drivers';
import main from 'power-ui/components/main/index';

run(main, {
  DOM: makeDOMDriver('#power-ui-app-container'),
  HTTP: makeHTTPDriver({autoSubscribe: true}),
  Route: hashRouteDriver,
});
