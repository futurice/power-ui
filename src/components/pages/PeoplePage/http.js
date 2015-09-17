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
    .startWith(PEOPLE_URL + '?limit=5&range_start=2015-09-01&range_end=2016-01-31')
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
