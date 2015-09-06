import {Rx} from '@cycle/core';
import {API_PATH} from 'power-ui/conf';
import {urlToRequestObjectWithHeaders, isTruthy} from 'power-ui/utils';

function mainHTTPResponse(HTTPSource) {
  const tribesState$ = HTTPSource
    .filter(response$ => response$.request.url === `${API_PATH}/tribes/`)
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .map(response => response.body.results)
    .publishValue([]).refCount();
  return tribesState$;
}

function mainHTTPRequest(...otherRequest$) {
  const initialTribeRequest$ = Rx.Observable.just(`${API_PATH}/tribes/`)
    .map(urlToRequestObjectWithHeaders);
  const request$ = Rx.Observable.merge(initialTribeRequest$, ...otherRequest$);
  return request$;
}

export default {mainHTTPRequest, mainHTTPResponse};
