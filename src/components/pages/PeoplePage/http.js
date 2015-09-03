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
    .startWith(PEOPLE_URL + '?limit=5')
    .map(urlToRequestObjectWithHeaders);

  const response$ = atomicResponse$
    .map(response => response.body.results)
    .scan((acc, curr) => acc.concat(curr));

  return {request$, response$}; // sink
}

export default PeoplePageHTTP;
