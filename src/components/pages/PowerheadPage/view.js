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
/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import _ from 'lodash';
import {formatAsFinancialsNumber} from 'power-ui/utils';
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
  const benchVal = Math.ceil(report.bench[monthIndex]);
  const totalIntsVal = Math.ceil(report.fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const extFteVal = Math.ceil(report.ext_fte[monthIndex]);
  return (
    <ul className={styles.peopleStats}>
      {renderPeopleStatsItem('Total exts.', extFteVal, 'FTE', true)}
      {renderPeopleStatsItem('Total ints.', totalIntsVal, 'FTE')}
      {renderPeopleStatsItem('Booked', bookedVal, 'FTE')}
      {renderPeopleStatsItem('Bench', benchVal, 'FTE')}
    </ul>
  );
}

function renderFinancialsStatsItem(label, value, legendBarStyle, special = false) {
  const financialsStatsItemClassName = special
    ? styles.financialsStatsItemSpecial
    : styles.financialsStatsItem;
  return (
    <li className={financialsStatsItemClassName}>
      <div className={legendBarStyle} />
      <span className={styles.financialsStatsLabel}>{label}</span>
      <span className={styles.financialsStatsValue}>{value}</span>
      <span className={styles.financialsStatsUnit}>{EURO_SYMBOL}</span>
    </li>
  );
}

function renderFinancialsStatsList(report, monthIndex) {
  const revenue = formatAsFinancialsNumber(report.value_creation[monthIndex]);
  const overruns = formatAsFinancialsNumber(report.overrun[monthIndex]);
  const overrunsBarStyle = styles.financialsStatsLegendBarOverruns;
  const revenueBarStyle = styles.financialsStatsLegendBarRevenue;
  return (
    <ul className={styles.financialsStats}>
      {renderFinancialsStatsItem('Overruns', overruns, overrunsBarStyle, true)}
      {renderFinancialsStatsItem('Confirmed revenue', revenue, revenueBarStyle)}
    </ul>
  );
}

function renderMonthGraphPeople(report, monthIndex) {
  const totalIntsVal = Math.ceil(report.fte[monthIndex]);
  const benchVal = Math.ceil(report.bench[monthIndex]);
  const extFteVal = Math.ceil(report.ext_fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const totalPeople = totalIntsVal + extFteVal;
  const boxes = _.range(totalPeople).map(i => {
    if (i < extFteVal) {
      return <li className={styles.monthGraphPeopleBoxExternal}></li>;
    } else if (i < extFteVal + bookedVal) {
      return <li className={styles.monthGraphPeopleBoxBooked}></li>;
    } else {
      return <li className={styles.monthGraphPeopleBoxBench}></li>;
    }
  });
  const chunks = _.chunk(boxes, 20);
  return (
    <ul className={styles.monthGraphPeopleBoxList}>
      {chunks.map(chunk =>
        <div className={styles.monthGraphPeopleChunk}>
          {chunk}
        </div>
      )}
    </ul>
  );
}

const financialsGraphMaxHeight = 250; // px
const financialsGraphMinWidth = 8; // px
const financialsGraphMaxWidth = 40; // px

function calculateFinancialsGraphWidth(report) {
  const x = report.maxFinancialsVal;
  const T = report.companyWideMaxFinancialsVal;
  const max = financialsGraphMaxWidth;
  const min = financialsGraphMinWidth;
  return ((x / T) * (max - min)) + min;
}

function renderMonthGraphFinancials(report, monthIndex) {
  const pxPerEur = financialsGraphMaxHeight / report.maxFinancialsVal;
  const confirmedRevenueThisMonth = report.value_creation[monthIndex];
  const overrunThisMonth = report.overrun[monthIndex];
  const breakEven = report.costs[monthIndex];
  const graphStyle = {
    width: `${calculateFinancialsGraphWidth(report)}px`,
    height: `${financialsGraphMaxHeight}px`,
  };
  const overrunStyle = {
    height: `${Math.ceil(overrunThisMonth * pxPerEur)}px`,
  };
  const confirmedStyle = {
    height: `${Math.ceil(confirmedRevenueThisMonth * pxPerEur)}px`,
  };
  const breakEvenStyle = {
    bottom: `${Math.ceil(breakEven * pxPerEur)}px`,
    display: confirmedRevenueThisMonth === 0 ? 'none' : 'inherit',
  };
  return (
    <ul className={styles.monthGraphFinancials} style={graphStyle}>
      <li className={styles.monthGraphFinancialsOverrun} style={overrunStyle} />
      <li className={styles.monthGraphFinancialsConfirmed} style={confirmedStyle} />
      <li className={styles.monthGraphFinancialsBreakEven} style={breakEvenStyle}>
        <span>break even</span>
      </li>
    </ul>
  );
}

function renderMonthGraph(report, monthIndex) {
  const monthTitle = _.keys(report.months[monthIndex])[0];
  const businessDays = `(${report.business_days[monthIndex]} days)`;
  return (
    <div className={styles.monthGraph}>
      <div className={styles.monthGraphShapes}>
        {renderMonthGraphPeople(report, monthIndex)}
        {renderMonthGraphFinancials(report, monthIndex)}
      </div>
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
      {renderFinancialsStatsList(report, monthIndex)}
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

function sortReportsByLargestTribe(reports) {
  return _.sortBy(reports, report => -report.fte[0]);
}

function augmentReportsWithMetadata(reports) {
  const reportsWithRespectiveTotals = reports.map(report => {
    // Array with the sum of all financials stats, one entry per month
    const financialsSum = _.zipWith(
      report.value_creation, report.overrun,
      _.add
    );
    const costs = _.zipWith(
      report.fte, report.ext_fte,
      _.add
    ).map(totalFte => totalFte * report.expenses_per_fte_month);
    // Among all months, highest sum of all financials for this tribe report:
    const maxFinancialsVal = Math.max(...costs, ...financialsSum);
    return {...report, financialsSum, costs, maxFinancialsVal};
  });
  const maxFinancialsValPerReport = reportsWithRespectiveTotals
    .map(report => report.maxFinancialsVal);
  const companyWideMaxFinancialsVal = Math.max(...maxFinancialsValPerReport);
  return reportsWithRespectiveTotals.map(report => {
    return {...report, companyWideMaxFinancialsVal};
  });
}

function renderReports(reports) {
  const sortedReports = sortReportsByLargestTribe(reports);
  const completeReports = augmentReportsWithMetadata(sortedReports);
  return (
    <div className={styles.contentWrapper}>
      {completeReports.map(report =>
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

function renderLoadingIndicator() {
  return (
    <div className={styles.contentWrapper}>
      <h3>Loading...</h3>
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
          {void locationFilterVTree}
        </div>
      </div>
      {state.reports.length === 0
        ? renderLoadingIndicator()
        : renderReports(state.reports)
      }
    </div>
  );
}

export default view;
