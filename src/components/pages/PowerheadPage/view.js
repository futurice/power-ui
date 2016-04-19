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
import * as Rx from 'rx';
import _ from 'lodash';
import {div, span, ul, li, h1, h2, h3} from '@cycle/dom';
import {formatAsFinancialsNumber, EURO_SYMBOL} from 'power-ui/utils';
import styles from './styles.scss';
import {combineReports, augmentReportsWithMetadata} from './reportUtils';

function renderPeopleStatsItem(label, value, unit, className, special = false) {
  const peopleStatsItemClassName = special
    ? styles.peopleStatsItemSpecial
    : styles.peopleStatsItem;

  return li(`.${peopleStatsItemClassName}.${className}`, [
    span(`.${styles.peopleStatsLabel}`, label),
    span(`.${styles.peopleStatsValue}`, value),
    span(`.${styles.peopleStatsUnit}`, unit),
  ]);
}

function renderPeopleStatsList(report, monthIndex) {
  const benchVal = Math.ceil(report.bench[monthIndex]);
  const totalIntsVal = Math.ceil(report.fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const extFteVal = Math.ceil(report.ext_fte[monthIndex]);
  return ul(`.${styles.peopleStats}`, [
    renderPeopleStatsItem('Total exts.', extFteVal, 'FTE', 'exts', true),
    renderPeopleStatsItem('Total ints.', totalIntsVal, 'FTE', 'ints'),
    renderPeopleStatsItem('Booked', bookedVal, 'FTE', 'booked'),
    renderPeopleStatsItem('Bench', benchVal, 'FTE', 'bench'),
  ]);
}

function renderFinancialsStatsItem(
  label, value, legendBarStyle, className, special = false) {
  const financialsStatsItemClassName = special
    ? styles.financialsStatsItemSpecial
    : styles.financialsStatsItem;
  return li(`.${financialsStatsItemClassName}.${className}`, [
    div(`.${legendBarStyle}`),
    span(`.${styles.financialsStatsLabel}`, label),
    span(`.${styles.financialsStatsValue}`, value),
    span(`.${styles.financialsStatsUnit}`, EURO_SYMBOL),
  ]);
}

function renderFinancialsStatsList(report, monthIndex) {
  const revenue = formatAsFinancialsNumber(report.value_creation[monthIndex]);
  const overruns = formatAsFinancialsNumber(report.overrun[monthIndex]);
  const overrunsBarStyle = styles.financialsStatsLegendBarOverruns;
  const revenueBarStyle = styles.financialsStatsLegendBarRevenue;
  return ul(`.${styles.financialsStats}`, [
    renderFinancialsStatsItem(
      'Overruns', overruns, overrunsBarStyle, 'overruns', true
    ),
    renderFinancialsStatsItem(
      'Confirmed revenue', revenue, revenueBarStyle, 'confirmed_revenue'
    ),
  ]);
}

function renderMonthGraphPeople(report, monthIndex) {
  const useSmallBoxesThreshold = 60;

  const totalIntsVal = Math.ceil(report.fte[monthIndex]);
  const benchVal = Math.ceil(report.bench[monthIndex]);
  const extFteVal = Math.ceil(report.ext_fte[monthIndex]);
  const bookedVal = totalIntsVal - benchVal;
  const totalPeople = totalIntsVal + extFteVal;

  const useSmallBoxes = (totalPeople > useSmallBoxesThreshold);

  const extBoxStyle = (useSmallBoxes)
          ? styles.monthGraphPeopleBoxExternalSmall
          : styles.monthGraphPeopleBoxExternal;
  const bookedBoxStyle = (useSmallBoxes)
          ? styles.monthGraphPeopleBoxBookedSmall
          : styles.monthGraphPeopleBoxBooked;
  const benchBoxStyle = (useSmallBoxes)
          ? styles.monthGraphPeopleBoxBenchSmall
          : styles.monthGraphPeopleBoxBench;
  const boxListStyle = (useSmallBoxes)
          ? styles.monthGraphPeopleBoxListSmall
          : styles.monthGraphPeopleBoxList;
  const peopleChunkStyle = (useSmallBoxes)
          ? styles.monthGraphPeopleChunkSmall
          : styles.monthGraphPeopleChunk;

  const boxes = _.range(totalPeople).map(i => {
    if (i < extFteVal) {
      return li(`.${extBoxStyle}`);
    } else if (i < extFteVal + bookedVal) {
      return li(`.${bookedBoxStyle}`);
    } else {
      return li(`.${benchBoxStyle}`);
    }
  });

  const numberOfPeopleInChunk = (useSmallBoxes) ? 40 : 20;

  const chunks = _.chunk(boxes, numberOfPeopleInChunk);

  return ul(`.${boxListStyle}`, chunks.map(chunk =>
    div(`.${peopleChunkStyle}`, chunk)
  ));
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
    display: overrunThisMonth === 0 ? 'none' : 'inherit',
  };
  const confirmedStyle = {
    height: `${Math.ceil(confirmedRevenueThisMonth * pxPerEur)}px`,
    display: confirmedRevenueThisMonth === 0 ? 'none' : 'inherit',
  };
  const breakEvenStyle = {
    bottom: `${Math.ceil(breakEven * pxPerEur)}px`,
    display: confirmedRevenueThisMonth === 0 ? 'none' : 'inherit',
  };
  return ul(`.${styles.monthGraphFinancials}`, {style: graphStyle}, [
    li(`.${styles.monthGraphFinancialsOverrun}`, {style: overrunStyle}),
    li(`.${styles.monthGraphFinancialsConfirmed}`, {style: confirmedStyle}),
    li(`.${styles.monthGraphFinancialsBreakEven}`, {style: breakEvenStyle}, [
      span('break even'),
    ]),
  ]);
}

function renderMonthGraph(report, monthIndex) {
  const monthTitle = _.keys(report.months[monthIndex])[0];
  const businessDays = `(${report.business_days[monthIndex]} days)`;
  return div(`.${styles.monthGraph}`, [
    div(`.${styles.monthGraphShapes}`, [
      renderMonthGraphPeople(report, monthIndex),
      renderMonthGraphFinancials(report, monthIndex),
    ]),
    div(`.${styles.monthGraphLabel}`, [
      span(`.${styles.monthGraphLabelTitle}`, monthTitle),
      span(`.${styles.monthGraphLabelSubtitle}`, businessDays),
    ]),
  ]);
}

function renderMonthReport(report, monthIndex) {
  return div(`.${styles.monthReport}`, [
    renderPeopleStatsList(report, monthIndex),
    renderMonthGraph(report, monthIndex),
    renderFinancialsStatsList(report, monthIndex),
  ]);
}

function renderMonthReportsRow(report) {
  return div(`.${styles.tribeMonthReportsRow}`,
    report.months.map((irrelevant, i) =>
      renderMonthReport(report, i)
    )
  );
}

function sortReportsByLargestTribe(reports) {
  return _.sortBy(reports, report => -report.fte[0]);
}

function renderReports(reports) {
  return div(`.${styles.contentWrapper}`, reports.map(report => {
    const tribeReportClass = [styles.tribeReport, 'tribe_report'].join(' ');
    return div(`.${tribeReportClass}`, [
      h2(report.name),
      h3('Staffing & value creation'),
      renderMonthReportsRow(report),
    ]);
  }));
}

function renderLoadingIndicator() {
  return div(`.${styles.contentWrapper}`, [
    h3('Loading...'),
  ]);
}

function view(state$, monthSelectorVTree$, locationFilterVTree$) {
  return Rx.Observable.combineLatest(
    state$, monthSelectorVTree$, locationFilterVTree$,
    (state, monthSelectorVTree, locationFilterVTree) => {
      let reports;
      if (state && state.filters && state.filters.location === 'all') {
        reports = combineReports(state.reports);
      } else {
        const sortedReports = sortReportsByLargestTribe(state.reports);
        const completeReports = augmentReportsWithMetadata(sortedReports);
        reports = completeReports;
      }

      return div([
        div(`.${styles.contentWrapper}`, [
          h1('Powerhead'),
          monthSelectorVTree,
          div(`.${styles.filtersContainer}`, [
            locationFilterVTree,
          ]),
        ]),
        reports.length === 0
          ? renderLoadingIndicator()
          : renderReports(reports),
      ]);
    });
}

export default view;
