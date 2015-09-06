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
