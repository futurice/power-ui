import {Rx} from '@cycle/core';
import _ from 'lodash';
import {API_PATH} from 'power-ui/conf';
import {urlToRequestObjectWithHeaders, isTruthy} from 'power-ui/utils';

// Handle all HTTP networking logic of this page
function PowerheadPageHTTP(sources) {
  const POWERHEAD_URL = `${API_PATH}/powerhead/`;

  const request$ = Rx.Observable.just(POWERHEAD_URL)
    .map(urlToRequestObjectWithHeaders);

  const response$ = sources.HTTP
    .filter(res$ => _.startsWith(res$.request.url, POWERHEAD_URL))
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .map(response => response.body.results)
    .shareReplay(1);

  return {request$, response$}; // sink
}

export default PowerheadPageHTTP;
