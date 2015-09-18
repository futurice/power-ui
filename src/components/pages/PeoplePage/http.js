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
function PeoplePageHTTP(sources) {
  const PEOPLE_URL = `${API_PATH}/people/`;

  const atomicResponse$ = sources.HTTP
    .filter(response$ => _.startsWith(response$.request.url, PEOPLE_URL))
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .shareReplay(1);

  const request$ = sources.availableTimeRange$.flatMap(timeRange => {
    const timeRangeParams = timeRangeToUrlParams(timeRange);
    return atomicResponse$
      .filter(response => response.body.next)
      .map(response => response.body.next.replace('limit=5', 'limit=40'))
      .startWith(PEOPLE_URL + `?limit=5&${timeRangeParams}`)
      .map(urlToRequestObjectWithHeaders);
  });

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
