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
import {formatAsFinancialsNumber, EURO_SYMBOL} from 'power-ui/utils';
import DataTable from 'power-ui/components/widgets/DataTable/index';

function formatAsFractionFinancials(dividend, divisor) {
  if (isNaN(dividend) || isNaN(divisor)) {
    return '';
  }
  if (!dividend && !divisor) {
    return '';
  }
  const dividendStr = `${Math.ceil(dividend)}${EURO_SYMBOL}`;
  const divisorStr = `${Math.ceil(divisor)}${EURO_SYMBOL}`;
  return `${dividendStr}\n/ ${divisorStr}`;
}

function preprocessProjectForDataTable(project) {
  const cases = [
    {
      type: 'allocation',
      label: project.name,
      start_date: project.start_date,
      end_date: project.end_date,
      opacity: 1,
    },
  ];
  return {...project, cases};
}

const CUSTOMER_COLUMN = {
  name: 'customer',
  label: 'Customer',
  valueFn: project => project.customer.name,
};

const PROJECT_COLUMN = {
  name: 'project',
  label: 'Project',
  valueFn: project => project.name,
};

const BUDGET_COLUMN = {
  name: 'budget',
  label: 'Budget',
  valueFn: project => {
    if (!project.budget) {
      return '';
    }
    return `${Math.ceil(project.budget)}${EURO_SYMBOL}`;
  },
  sortValueFn: project => project.budget || 0,
};

const SALES_PRICE_COLUMN = {
  name: 'sales-price',
  label: 'Sales price',
  valueFn: project => {
    if (!project.sales_price) {
      return '';
    }
    return `${project.sales_price.toFixed(1)}${EURO_SYMBOL}`;
  },
  sortValueFn: project => project.sales_price || 0,
};

function makeValueCreationColumn(state) {
  return {
    name: 'value-creation',
    label: `Value creation in ${state.timeRange.start.format('MMMM')} / Total`,
    valueFn: project =>
      formatAsFractionFinancials(
        project.value_creation.in_month, project.value_creation.total
      ),
    sortValueFn: project =>
      project.value_creation.in_month,
  };
}

function makeOverrunColumn(state) {
  return {
    name: 'overrun',
    label: `Overrun in ${state.timeRange.start.format('MMMM')} / Total`,
    valueFn: project =>
      formatAsFractionFinancials(
        project.overrun.in_month, project.overrun.total
      ),
    sortValueFn: project =>
      project.overrun.total || 0,
  };
}

const ORDERBOOK_COLUMN = {
  name: 'orderbook',
  label: 'Orderbook',
  valueFn: project => {
    if (!project.orderbook) {
      return '';
    }
    return `${formatAsFinancialsNumber(project.orderbook)}${EURO_SYMBOL}`;
  },
  sortValueFn: project => project.orderbook || 0,
};

const MAN_DAYS_COLUMN = {
  name: 'man-days',
  label: 'Man days',
  valueFn: project => String(parseInt(project.man_days) || ''),
  sortValueFn: project => project.man_days || 0,
};

function DataTableWrapper(state$, DOM) {
  const props$ = state$.map(state => ({
    items: state.projects.map(preprocessProjectForDataTable),
    timeRange: state.timeRange,
    progress: state.progress,
    columns: [
      CUSTOMER_COLUMN,
      PROJECT_COLUMN,
      BUDGET_COLUMN,
      SALES_PRICE_COLUMN,
      makeValueCreationColumn(state),
      makeOverrunColumn(state),
      ORDERBOOK_COLUMN,
      MAN_DAYS_COLUMN,
    ],
    defaultSortCriteria: '-overrun',
    emptyTitle: 'Nothing',
    emptySubtitle: 'No projects found.',
  }));
  return DataTable({DOM, props$});
}

export default DataTableWrapper;
