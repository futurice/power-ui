/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import _ from 'lodash';
import styles from './styles.scss';
hJSX();

const DEFAULT_SORT_CRITERIA = '+name';

function interpret(DOM) {
  return {
    toggleSortCriteria$: Rx.Observable.merge(
      DOM.select('.column-sort-name').events('click').map(() => 'name'),
      DOM.select('.column-sort-tribe').events('click').map(() => 'tribe'),
      DOM.select('.column-sort-skills').events('click').map(() => 'skills'),
      DOM.select('.column-sort-project').events('click').map(() => 'project'),
      DOM.select('.column-sort-unused-utz').events('click').map(() => 'unused-utz')
    ),
  };
}

function makeSortKeyFn(sortProperty) {
  return function sortKeyFn(person) {
    switch (sortProperty) {
    case 'name': return person.name;
    case 'tribe': return person.tribe.name;
    case 'skills': return person.skills;
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

  return props$.combineLatest(sortCriteria$,
    (props, sortCriteria) => ({...props, sortCriteria})
  );
}

function floatFormatter(cell, n) {
  const num = parseFloat(cell);
  if (num) {
    return num.toFixed(n);
  }
  return 0;
}

function percentageFormatter(cell) {
  const num = parseFloat(cell);
  if (num) {
    return (num.toFixed(2) * 100).toFixed(0) + '%';
  }
  return '0%';
}

function tableHeaders(timeFrame) {
  const s = styles.selectableColumnHeader;
  return (
    <tr>
      <th></th>
      <th className={`${s} column-sort-name`}>Name</th>
      <th className={`${s} column-sort-tribe`}>Tribe</th>
      <th className={`${s} column-sort-skills`}>Skills</th>
      <th className={`${s} column-sort-project`}>Project</th>
      <th className={`${s} column-sort-unused-utz`}>
        Unused UTZ in {timeFrame.start.format('MMMM')}
      </th>
      <th className={s}>[ Timeline here ] </th>
      <th></th>
    </tr>
  );
}

function tableRows(people) {
  if (people) {
    return people.map((p) =>
      <tr key={p.id}>
        <td></td>
        <td>{p.name}</td>
        <span style={{display: 'none'}}>{JSON.stringify(p)}</span>
        <td>{p.tribe.name}</td>
        <td>{p.skills}</td>
        <td>{p.current_projects.join(', ')}</td>
        <td>{percentageFormatter(p.unused_utz_in_month)}</td>
        <td>
          {p.allocations.map((a) => {
            return (
              <span key={a.id}>
                {floatFormatter(a.total_allocation, 2)}
                {a.start_date} - {a.end_date}
              </span>
            );
          })}
          {p.absences.map((b) => {
            return (
              <span key={b.id}>
                {b.start_date} - {b.end_date}
              </span>
            );
          })}
        </td>
        <td></td>
      </tr>
    );
  }
}

function view(props$) {
  return props$.map(({people, sortCriteria, timeFrame}) =>
    <div className={styles.dataTable}>
      <table>
        <thead>
          {tableHeaders(timeFrame)}
        </thead>
        {tableRows(sort(people, sortCriteria))}
      </table>
    </div>
  );
}

function DataTable(sources) {
  const actions = interpret(sources.DOM);
  const state$ = model(sources.props$, actions);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$,
  };
  return sinks;
}

export default DataTable;
