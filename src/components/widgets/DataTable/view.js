/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import _ from 'lodash';
import styles from './styles.scss';
import {renderTimelineHeader, renderTimelineCases} from './view-timeline';

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
  const unusedUtzLabel = `Unused UTZ in ${timeFrame.start.format('MMMM')}`;
  return (
    <tr>
      <th></th>
      {renderTableHeaderColumn('name', 'Name', sortCriteria)}
      {renderTableHeaderColumn('tribe', 'Tribe', sortCriteria)}
      {renderTableHeaderColumn('skills', 'Skills', sortCriteria)}
      {renderTableHeaderColumn('project', 'Project', sortCriteria)}
      {renderTableHeaderColumn('unused-utz', unusedUtzLabel, sortCriteria)}
      {renderTimelineHeader(timeFrame)}
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

function percentageFormatter(cell) {
  const num = parseFloat(cell);
  if (num) {
    return (num.toFixed(2) * 100).toFixed(0) + '%';
  }
  return '0%';
}

function tableRows(people, timeFrame, sortCriteria) {
  return people.map(person => {
    const name = person.name;
    const tribe = person.tribe.name;
    const skills = person.skills;
    const projects = person.current_projects.join(', ');
    const unusedUtz = percentageFormatter(person.unused_utz_in_month);
    const timeline = renderTimelineCases(person, timeFrame);
    return (
      <tr key={person.id}>
        <td></td>
        <span style={{display: 'none'}}>{JSON.stringify(person)}</span>
        <td className={tdClassName('name', sortCriteria)}>{name}</td>
        <td className={tdClassName('tribe', sortCriteria)}>{tribe}</td>
        <td className={tdClassName('skills', sortCriteria)}>{skills}</td>
        <td className={tdClassName('project', sortCriteria)}>{projects}</td>
        <td className={tdClassName('unused-utz', sortCriteria)}>{unusedUtz}</td>
        <td className={styles.timelineColumn}>{timeline}</td>
      </tr>
    );
  });
}

function renderDataTable(people, timeFrame, sortCriteria) {
  return (
    <div className={styles.dataTable}>
      <table>
        <thead>
          {tableHeaders(timeFrame, sortCriteria)}
        </thead>
        {tableRows(people, timeFrame, sortCriteria)}
      </table>
    </div>
  );
}

const placeholderData = _.fill(Array(5), {
  name: '',
  current_projects: [],
  allocations: [],
  absences: [],
  tribe: {
    name: '',
  },
});

function view(props$) {
  return props$.map(({people, timeFrame, sortCriteria}) => {
    if (people.length === 0) {
      return renderDataTable(placeholderData, timeFrame, sortCriteria);
    } else {
      return renderDataTable(people, timeFrame, sortCriteria);
    }
  });
}

export default view;
