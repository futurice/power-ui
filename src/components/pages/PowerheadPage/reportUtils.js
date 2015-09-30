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

import _ from 'lodash';

function augmentReportsWithFinancials(reports) {
  return reports.map(report => {
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
}

function augmentReportsWithMetadata(reports) {
  const reportsWithRespectiveTotals = augmentReportsWithFinancials(reports);
  const maxFinancialsValPerReport = reportsWithRespectiveTotals
    .map(report => report.maxFinancialsVal);
  const companyWideMaxFinancialsVal = Math.max(...maxFinancialsValPerReport);
  return reportsWithRespectiveTotals.map(report => {
    return {...report, companyWideMaxFinancialsVal};
  });
}

// Combines an array of n reports into an array of 1 report.
function combineReports(reports) {
  if (reports.length === 0) {
    return [];
  }

  const augmentedReports = augmentReportsWithFinancials(reports);

  const monthCount = reports[0].months.length;
  const initialReport = {
    months: reports[0].months,
    business_days: reports[0].business_days,
    value_creation: _.fill(Array(monthCount), 0),
    orderbook: _.fill(Array(monthCount), 0),
    overrun: _.fill(Array(monthCount), 0),
    fte: _.fill(Array(monthCount), 0),
    bench: _.fill(Array(monthCount), 0),
    ext_fte: _.fill(Array(monthCount), 0),
    costs: _.fill(Array(monthCount), 0),
    financialsSum: _.fill(Array(monthCount), 0),
    maxFinancialsVal: _.sum(augmentedReports.map(report => report.maxFinancialsVal)),
    companyWideMaxFinancialsVal: _.sum(augmentedReports
      .map(report => report.maxFinancialsVal)
    ),
    name: 'All',
    expenses_per_fte_month: reports.map(report => report.expenses_per_fte_month),
  };

  const combined = augmentedReports.reduce((combinedReport, tribeReport) => {
    const attributesToCombine = [
      'value_creation', 'overrun', 'fte', 'bench', 'ext_fte', 'costs', 'financialsSum',
    ];
    attributesToCombine.forEach(attr => {
      combinedReport[attr] = _.zipWith(combinedReport[attr], tribeReport[attr], _.add);
    });

    return combinedReport;
  }, initialReport);

  return [combined];
}

export default {augmentReportsWithMetadata, combineReports};
