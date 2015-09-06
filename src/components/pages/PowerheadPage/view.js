/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import {timeRangeIndexArray, formatAsFinanceNumber} from 'power-ui/utils';
import styles from './styles.scss';

const EURO_SYMBOL = '\u20AC';

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

function renderPeopleStatsList(report, monthIndex) {
  const benchVal = Math.round(report.bench[monthIndex]);
  const totalIntsVal = Math.round(report.fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const extFteVal = Math.round(report.ext_fte[monthIndex]);
  return (
    <ul className={styles.peopleStats}>
      {renderPeopleStatsItem('Bench', benchVal, 'FTE')}
      {renderPeopleStatsItem('Booked', bookedVal, 'FTE')}
      {renderPeopleStatsItem('Total ints.', totalIntsVal, 'FTE')}
      {renderPeopleStatsItem('Total exts.', extFteVal, 'FTE', true)}
    </ul>
  );
}

function renderFinanceStatsItem(label, value, unit, special = false) {
  const financeStatsItemClassName = special
    ? styles.financeStatsItemSpecial
    : styles.financeStatsItem;
  return (
    <li className={financeStatsItemClassName}>
      <span className={styles.financeStatsLabel}>{label}</span>
      <span className={styles.financeStatsValue}>{value}</span>
      <span className={styles.financeStatsUnit}>{unit}</span>
    </li>
  );
}

function renderFinanceStatsList(report, monthIndex) {
  const valueCreationVal = formatAsFinanceNumber(report.value_creation[monthIndex]);
  const orderbookVal = formatAsFinanceNumber(report.orderbook[monthIndex]);
  const overrunsVal = formatAsFinanceNumber(report.overrun[monthIndex]);
  return (
    <ul className={styles.financeStats}>
      {renderFinanceStatsItem('Value creation', valueCreationVal, EURO_SYMBOL)}
      {renderFinanceStatsItem('Orderbook', orderbookVal, EURO_SYMBOL)}
      {renderFinanceStatsItem('Overruns', overrunsVal, EURO_SYMBOL)}
    </ul>
  );
}

function renderMonthReport(report, timeRange, monthIndex) {
  const style = {width: `${100 / timeRangeIndexArray(timeRange).length}%`};
  return (
    <div className={styles.monthGraph} style={style}>
      {renderPeopleStatsList(report, monthIndex)}
      {renderFinanceStatsList(report, monthIndex)}
    </div>
  );
}

function renderGraphRow(report, timeRange) {
  const monthReports = timeRangeIndexArray(timeRange)
    .map(i => renderMonthReport(report, timeRange, i));
  return (
    <div className={styles.tribeReportGraphRow}>
      {monthReports}
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
