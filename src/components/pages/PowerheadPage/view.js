/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import _ from 'lodash';
import {formatAsFinanceNumber} from 'power-ui/utils';
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
      {renderPeopleStatsItem('Total exts.', extFteVal, 'FTE', true)}
      {renderPeopleStatsItem('Total ints.', totalIntsVal, 'FTE')}
      {renderPeopleStatsItem('Booked', bookedVal, 'FTE')}
      {renderPeopleStatsItem('Bench', benchVal, 'FTE')}
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
      {renderFinanceStatsItem('Overruns', overrunsVal, EURO_SYMBOL, true)}
      {renderFinanceStatsItem('Orderbook', orderbookVal, EURO_SYMBOL)}
      {renderFinanceStatsItem('Value creation', valueCreationVal, EURO_SYMBOL)}
    </ul>
  );
}

function renderMonthGraph(report, monthIndex) {
  const monthTitle = _.keys(report.months[monthIndex])[0];
  const businessDays = `(${report.business_days[monthIndex]} days)`;
  return (
    <div className={styles.monthGraph}>
      <div className={styles.monthGraphShapes}></div>
      <div className={styles.monthGraphLabel}>
        <span className={styles.monthGraphLabelTitle}>{monthTitle}</span>
        <span className={styles.monthGraphLabelSubtitle}>{businessDays}</span>
      </div>
    </div>
  );
}

function renderMonthReport(report, monthIndex) {
  return (
    <div className={styles.monthReport}>
      {renderPeopleStatsList(report, monthIndex)}
      {renderMonthGraph(report, monthIndex)}
      {renderFinanceStatsList(report, monthIndex)}
    </div>
  );
}

function renderMonthReportsRow(report) {
  const monthReports = report.months.map((irrelevant, i) =>
    renderMonthReport(report, i)
  );
  return (
    <div className={styles.tribeMonthReportsRow}>
      {monthReports}
    </div>
  );
}

function renderReports(reports) {
  return (
    <div className={styles.contentWrapper}>
      {reports.map(report =>
        <div className={styles.tribeReport}>
          <h2>{report.name}</h2>
          <h3>Staffing &amp; value creation</h3>
          {renderMonthReportsRow(report)}
          {void JSON.stringify(report)}
        </div>
      )}
    </div>
  );
}

function view(state$, locationFilterVTree$) {
  return Rx.Observable.combineLatest(
    state$, locationFilterVTree$,
    (state, locationFilterVTree) =>
    <div>
      <div className={styles.contentWrapper}>
        <h1>Powerhead</h1>
        <div className={styles.filtersContainer}>
          {locationFilterVTree}
        </div>
      </div>
      {renderReports(state.reports)}
    </div>
  );
}

export default view;
