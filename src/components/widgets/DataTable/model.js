import _ from 'lodash';

const DEFAULT_SORT_CRITERIA = '+name';

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
