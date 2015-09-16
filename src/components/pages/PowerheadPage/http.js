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

function timeRangeToUrlParams(timeRange) {
  const format = 'YYYY-MM-DD';
  const range_start = timeRange.start.format(format);
  const range_end = timeRange.end.format(format);
  return `range_start=${range_start}&range_end=${range_end}`;
}

// Handle all HTTP networking logic of this page
function PowerheadPageHTTP(sources) {
  const POWERHEAD_URL = `${API_PATH}/powerhead/`;

  const request$ = sources.timeRange$
    .map(timeRangeToUrlParams)
    .map(timeRangeParams => POWERHEAD_URL + `?${timeRangeParams}`)
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
