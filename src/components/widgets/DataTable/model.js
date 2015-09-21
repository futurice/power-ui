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

const DEFAULT_SORT_CRITERIA = '-unused-utz';

function makeSortKeyFn(sortProperty) {
  return function sortKeyFn(person) {
    switch (sortProperty) {
    case 'name': return person.name.toLowerCase();
    case 'tribe': return person.tribe.name.toLowerCase();
    case 'skills': return person.skills.toLowerCase();
    case 'project': return person.current_projects.join(' ').toLowerCase();
    case 'unused-utz': return person.unused_utz_in_month;
    default: return person.name;
    }
  };
}

function sort(peopleArray, sortCriteria) {
  const sortProperty = sortCriteria.substring(1);
  const shouldReverse = sortCriteria.charAt(0) === '-';
  const sortedPeopleArray = _.sortBy(peopleArray, makeSortKeyFn(sortProperty));
  if (shouldReverse) {
    return sortedPeopleArray.slice().reverse();
  } else {
    return sortedPeopleArray;
  }
}

function reverseCriteria(criteria) {
  const isAscending = criteria.charAt(0) === '+';
  const ascendingCriteria = criteria.replace(/^(\+|\-|)/, '+');
  const descendingCriteria = criteria.replace(/^\+/, '-');
  return isAscending ? descendingCriteria : ascendingCriteria;
}

function model(props$, actions) {
  const sortCriteria$ = actions.toggleSortCriteria$
    .startWith(DEFAULT_SORT_CRITERIA)
    .scan((prevCriteria, nextCriteria) => {
      if (prevCriteria.substring(1) === nextCriteria) {
        return reverseCriteria(prevCriteria);
      } else {
        return reverseCriteria(nextCriteria);
      }
    });

  return props$.combineLatest(sortCriteria$, (props, sortCriteria) => {
    return {
      people: sort(props.people, sortCriteria),
      progress: props.progress,
      timeRange: props.timeRange,
      sortCriteria,
    };
  });
}

export default model;
