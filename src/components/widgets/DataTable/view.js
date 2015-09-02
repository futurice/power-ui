/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import styles from './styles.scss';
hJSX();

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

function columnFromCriteria(criteria) {
  return criteria.replace(/^(\-|\+)/, '');
}

function thClassName(column, criteria) {
  let selectableClassName;
  if (columnFromCriteria(criteria) === column) {
    selectableClassName = styles.selectableColumnHeaderActive;
  } else {
    selectableClassName = styles.selectableColumnHeader;
  }
  return `${selectableClassName} column-sort-${column}`;
}

function renderHeaderArrowOrNot(column, criteria) {
  if (columnFromCriteria(criteria) !== column) {
    return null;
  }
  const getArrowIconStyle = (sortCriteria) => {
    switch (sortCriteria.charAt(0)) {
    case '-': return styles.arrowIconDescending;
    case '+':
    default: return styles.arrowIconAscending;
    }
  };
  return (
    <img className={getArrowIconStyle(criteria)} src="img/arrow_icon.svg" />
  );
}

function renderTableHeaderColumn(column, label, criteria) {
  return (
    <th className={thClassName(column, criteria)}>
      <span>{label}</span>
      {renderHeaderArrowOrNot(column, criteria)}
    </th>
  );
}

function tableHeaders(timeFrame, sortCriteria) {
  const startMonth = timeFrame.start.format('MMMM');
  return (
    <tr>
      <th></th>
      {renderTableHeaderColumn('name', 'Name', sortCriteria)}
      {renderTableHeaderColumn('tribe', 'Tribe', sortCriteria)}
      {renderTableHeaderColumn('skills', 'Skills', sortCriteria)}
      {renderTableHeaderColumn('project', 'Project', sortCriteria)}
      {renderTableHeaderColumn(
        'unused-utz', `Unused UTZ in ${startMonth}`, sortCriteria
      )}
      <th>[ Timeline here ]</th>
      <th></th>
    </tr>
  );
}

function tdClassName(column, criteria) {
  if (columnFromCriteria(criteria) === column) {
    return styles.cellInSortedColumn;
  } else {
    return '';
  }
}

function tableRows(people, sortCriteria) {
  if (people) {
    return people.map((p) =>
      <tr key={p.id}>
        <td></td>
        <span style={{display: 'none'}}>{JSON.stringify(p)}</span>
        <td className={tdClassName('name', sortCriteria)}>
          {p.name}
        </td>
        <td className={tdClassName('tribe', sortCriteria)}>
          {p.tribe.name}
        </td>
        <td className={tdClassName('skills', sortCriteria)}>
          {p.skills}
        </td>
        <td className={tdClassName('project', sortCriteria)}>
          {p.current_projects.join(', ')}
        </td>
        <td className={tdClassName('unused-utz', sortCriteria)}>
          {percentageFormatter(p.unused_utz_in_month)}
        </td>
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
  return props$.map(({people, timeFrame, sortCriteria}) =>
    <div className={styles.dataTable}>
      <table>
        <thead>
          {tableHeaders(timeFrame, sortCriteria)}
        </thead>
        {tableRows(people, sortCriteria)}
      </table>
    </div>
  );
}

export default view;
