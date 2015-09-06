/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import {timeRangeIndexArray} from 'power-ui/utils';
import styles from './styles.scss';

function renderPeopleStatsItem(label, value, unit, special = false) {
  const peopleStatsItemClassName = special
    ? styles.peopleStatsItemSpecial
    : styles.peopleStatsItem;
  return (
    <li className={peopleStatsItemClassName}>
      <span className={styles.peopleStatsLabel}>{label}</span>
      <span className={styles.peopleStatsValue}>{value}</span>
      <span className={styles.peopleStatsUnit}>{unit}</span>
    </li>
  );
}

function renderMonthGraph(report, timeRange, monthIndex) {
  const style = {width: `${100 / timeRangeIndexArray(timeRange).length}%`};
  const benchVal = Math.round(report.bench[monthIndex]);
  const totalIntsVal = Math.round(report.fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const extFteVal = Math.round(report.ext_fte[monthIndex]);
  return (
    <div className={styles.monthGraph} style={style}>
      <ul className={styles.peopleStats}>
        {renderPeopleStatsItem('Bench', benchVal, 'FTE')}
        {renderPeopleStatsItem('Booked', bookedVal, 'FTE')}
        {renderPeopleStatsItem('Total ints.', totalIntsVal, 'FTE')}
        {renderPeopleStatsItem('Total exts.', extFteVal, 'FTE', true)}
      </ul>
    </div>
  );
}

function renderGraphRow(report, timeRange) {
  const graphs = timeRangeIndexArray(timeRange)
    .map(i => renderMonthGraph(report, timeRange, i));
  return (
    <div className={styles.tribeReportGraphRow}>
      {graphs}
    </div>
  );
}

function renderReports(reports, timeRange) {
  return (
    <div className={styles.contentWrapper}>
      {reports.map(report =>
        <div className={styles.tribeReport}>
          <h2>{report.name}</h2>
          <h3>Staffing &amp; value creation</h3>
          {renderGraphRow(report, timeRange)}
          {JSON.stringify(report)}
        </div>
      )}
    </div>
  );
}

function view(state$, timeRange$, locationFilterVTree$) {
  return Rx.Observable.combineLatest(
    state$, timeRange$, locationFilterVTree$,
    (state, timeRange, locationFilterVTree) =>
    <div>
      <div className={styles.contentWrapper}>
        <h1>Powerhead</h1>
        <div className={styles.filtersContainer}>
          {locationFilterVTree}
        </div>
      </div>
      {renderReports(state.reports, timeRange)}
    </div>
  );
}

export default view;
