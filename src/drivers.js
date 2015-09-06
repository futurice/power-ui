import {Rx} from '@cycle/core';

function hashRouteDriver() {
  return Rx.Observable.merge(
    Rx.Observable.just(window.location.hash.replace('#', '')),

    Rx.Observable.fromEvent(window, 'hashchange')
      .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
  );
}

export default {hashRouteDriver};
