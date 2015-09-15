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
import _ from 'lodash';
import {API_PATH} from 'power-ui/conf';
import {urlToRequestObjectWithHeaders, isTruthy} from 'power-ui/utils';

// Handle all HTTP networking logic of this page
function PeoplePageHTTP(sources) {
  const PEOPLE_URL = `${API_PATH}/people/`;

  const atomicResponse$ = sources.HTTP
    .filter(response$ => _.startsWith(response$.request.url, PEOPLE_URL))
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .shareReplay(1);

  const request$ = atomicResponse$
    .filter(response => response.body.next)
    .map(response => response.body.next.replace('limit=5', 'limit=40'))
    // TODO get real time range from sources somehow
    .startWith(PEOPLE_URL + '?limit=5&range_start=2015-09-01&range_end=2015-11-30')
    .map(urlToRequestObjectWithHeaders);

  const response$ = atomicResponse$
    .map(response => response.body.results)
    .scan((acc, curr) => acc.concat(curr))
    .withLatestFrom(atomicResponse$, (people, response) => {
      return {
        people,
        progress: people.length / response.body.count,
      };
    });

  return {request$, response$}; // sink
}

export default PeoplePageHTTP;
