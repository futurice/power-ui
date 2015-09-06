/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import _ from 'lodash';
import styles from './styles.scss';
import {formatAsPercentage} from 'power-ui/utils';
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

function renderProgressBar(progress) {
  if (progress < 1) {
    return <div className={styles.progressBar} />;
  } else {
    return null;
  }
}

function tableHeaders(timeRange, progress, sortCriteria) {
  const unusedUtzLabel = `Unused UTZ in ${timeRange.start.format('MMMM')}`;
  return (
    <tr>
      <th style={{position: 'relative'}}>{renderProgressBar(progress)}</th>
      {renderTableHeaderColumn('name', 'Name', sortCriteria)}
      {renderTableHeaderColumn('tribe', 'Tribe', sortCriteria)}
      {renderTableHeaderColumn('skills', 'Skills', sortCriteria)}
      {renderTableHeaderColumn('project', 'Project', sortCriteria)}
      {renderTableHeaderColumn('unused-utz', unusedUtzLabel, sortCriteria)}
      {renderTimelineHeader(timeRange)}
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

function tableRows(people, timeRange, sortCriteria) {
  const zeroWidthSpace = '\u200B';
  return people.map(person => {
    const name = person.name;
    const tribe = person.tribe.name;
    const skills = person.skills;
    const projects = person.current_projects.join(', ');
    const unusedUtz = formatAsPercentage(person.unused_utz_in_month) || zeroWidthSpace;
    const timeline = renderTimelineCases(person, timeRange);
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

function renderDataTable(people, progress, timeRange, sortCriteria) {
  return (
    <div className={styles.dataTable}>
      <table>
        <thead>
          {tableHeaders(timeRange, progress, sortCriteria)}
        </thead>
        {tableRows(people, timeRange, sortCriteria)}
      </table>
    </div>
  );
}

const placeholderData = _.fill(Array(10), {
  name: '',
  current_projects: [],
  allocations: [],
  absences: [],
  tribe: {
    name: '',
  },
});

function renderNobody(people, progress, timeRange, sortCriteria) {
  return (
    <section className={styles.nobodyOverlay}>
      {renderDataTable(placeholderData, progress, timeRange, sortCriteria)}
      <div className={styles.nobodyOverlayContent}>
        <h1>Nobody</h1>
        <h4>Perhaps we should hire more people?</h4>
      </div>
    </section>
  );
}

function view(props$) {
  return props$.map(({people, progress, timeRange, sortCriteria}) => {
    if (progress < 1 && people.length === 0) {
      return renderDataTable(placeholderData, progress, timeRange, sortCriteria);
    } else if (people.length === 0) {
      return renderNobody(placeholderData, progress, timeRange, sortCriteria);
    } else {
      return renderDataTable(people, progress, timeRange, sortCriteria);
    }
  });
}

export default view;
