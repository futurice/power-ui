import _ from 'lodash';
import {URL_ROOT} from 'power-ui/utils';

// Handle all HTTP networking logic of this page
function PeoplePageHTTP(sources) {
  const PEOPLE_URL = `${URL_ROOT}/people/`;
  const atomicResponse$ = sources.HTTP
    .filter(res$ => _.startsWith(res$.request, PEOPLE_URL))
    .mergeAll()
    .shareReplay(1);
  const request$ = atomicResponse$
    .filter(responseObj => responseObj.body.next)
    .map(responseObj => responseObj.body.next.replace('limit=5', 'limit=40'))
    .startWith(PEOPLE_URL + '?limit=5');
  const arrayOfPeople$ = atomicResponse$
    .map(responseObj => responseObj.body.results)
    .scan((acc, curr) => acc.concat(curr));
  const response$ = arrayOfPeople$;

  const sink = {
    request$,
    response$,
  };
  return sink;
}

export default PeoplePageHTTP;
