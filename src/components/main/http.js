/**
 * This file is part of power-ui, originally developed by Futurice Oy.
 *
 * power-ui is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
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
