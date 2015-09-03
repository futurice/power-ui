import _ from 'lodash';
import {URL_ROOT, isTruthy} from 'power-ui/utils';

// Handle all HTTP networking logic of this page
function PeoplePageHTTP(sources) {
  const PEOPLE_URL = `${URL_ROOT}/people/`;

  const atomicResponse$ = sources.HTTP
    .filter(response$ => _.startsWith(response$.request, PEOPLE_URL))
    .mergeAll()
    .filter(response => isTruthy(response.body))
    .shareReplay(1);

  const request$ = atomicResponse$
    .filter(response => response.body.next)
    .map(response => response.body.next.replace('limit=5', 'limit=40'))
    .startWith(PEOPLE_URL + '?limit=5');

  const response$ = atomicResponse$
    .map(response => response.body.results)
    .scan((acc, curr) => acc.concat(curr));

  return {request$, response$}; // sink
}

export default PeoplePageHTTP;
