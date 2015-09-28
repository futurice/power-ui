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

/**
 * Handle all HTTP networking logic of a page that expects a big array of
 * objects. Specify the API path segment such as `/people` and `/project` and
 * this function returns the HTTP component that handles networking for that
 * API path and page.
 *
 * @param {String} pathSegment an API path segment like '/foo' or '/bar'
 */
function makeDataTablePageHTTP(pathSegment) {
  return function DataTablePageHTTP(sources) {
    const PEOPLE_URL = `${API_PATH}${pathSegment}`;

    const atomicResponse$ = sources.HTTP
      .filter(response$ => _.startsWith(response$.request.url, PEOPLE_URL))
      .mergeAll()
      .filter(response => isTruthy(response.body))
      .shareReplay(1);

    const request$ = sources.props$.first().flatMap(({availableTimeRange}) => {
      const timeRangeParams = timeRangeToUrlParams(availableTimeRange);
      return atomicResponse$
        .filter(response => response.body.next)
        .map(response => response.body.next.replace('limit=5', 'limit=40'))
        .startWith(PEOPLE_URL + `?limit=5&${timeRangeParams}`)
        .map(urlToRequestObjectWithHeaders);
    });

    const response$ = atomicResponse$
      .map(response => response.body.results)
      .scan((acc, curr) => acc.concat(curr))
      .withLatestFrom(atomicResponse$, (dataArray, response) => {
        return {
          dataArray,
          progress: dataArray.length / response.body.count,
        };
      });

    return {request$, response$}; // sink
  };
}

export default makeDataTablePageHTTP;
