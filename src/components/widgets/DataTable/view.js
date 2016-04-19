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
import styles from './styles.scss';
import {renderTimelineHeader, renderTimelineCases} from './view-timeline';
import {safeCoerceToString} from 'power-ui/utils';
import {
  div,
  img,
  th,
  span,
  tr,
  td,
  a,
  thead,
  table,
  section,
  h1,
  h4,
} from '@cycle/dom';

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
  selectableClassName = safeCoerceToString(selectableClassName);
  return `${selectableClassName} sortable-column`.trim();
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
  return img(`.${getArrowIconStyle(criteria)}`, {
    attrs: {src: 'img/arrow_icon.svg'},
  });
}

function renderTableHeaderColumn(column, label, criteria) {
  return th(`.${thClassName(column, criteria)}`, {attrs: {'data-column': column}}, [
    span(label),
    renderHeaderArrowOrNot(column, criteria),
  ]);
}

function renderProgressBar(progress) {
  if (progress < 1) {
    return div(`.${styles.progressBar}`);
  } else {
    return null;
  }
}

function tableHeaders(state) {
  return tr([
    th({style: {position: 'relative'}}, [renderProgressBar(state.progress)]),
    ...state.columns.map(column =>
      renderTableHeaderColumn(column.name, column.label, state.sortCriteria)
    ),
    renderTimelineHeader(state.timeRange),
  ]);
}

function tdClassName(column, criteria) {
  if (columnFromCriteria(criteria) === column) {
    return styles.cellInSortedColumn;
  } else {
    return void 0; // undefined
  }
}

function preprocessCellValue(state, item) {
  return function preprocessCellValueWithStateAndItem(column) {
    const zeroWidthSpace = '\u200B';
    let maybeValue;
    try {
      maybeValue = column.valueFn(item);
    } catch (err) {
      maybeValue = null;
    }
    let link;
    try {
      link = column.linkFn(item);
    } catch (err) {
      link = null;
    }
    const cellValue = maybeValue === null ? zeroWidthSpace : maybeValue;
    return {
      cellValue,
      link,
      columnName: column.name,
      sortCriteria: state.sortCriteria,
    };
  };
}

function tableRows(state) {
  return state.items.map(item => {
    const columnValues = state.columns.map(preprocessCellValue(state, item));
    const timeline = renderTimelineCases(item, state.timeRange);
    return tr([
      td(),
      ...columnValues.map(({cellValue, link, columnName, sortCriteria}) =>
        td(`.${tdClassName(columnName, sortCriteria)}`, [
          link ? a('.link', {attrs: {href: link}}, [cellValue]) : cellValue,
        ])
      ),
      td(`.${styles.timelineColumn}`, timeline),
    ]);
  });
}

function renderDataTable(state, name) {
  const dataTableStyle = safeCoerceToString(styles.dataTable);
  return div(`.${name}.${dataTableStyle}`, [
    table([
      thead([
        tableHeaders(state),
      ]),
      ...tableRows(state),
    ]),
  ]);
}

const placeholderData = _.fill(Array(10), {name: '', cases: []});

function renderEmpty(state, name) {
  return section(`.${styles.emptyOverlay}`, [
    renderDataTable({...state, items: placeholderData}, name),
    div(`.${styles.emptyOverlayContent}`, [
      h1(state.emptyTitle),
      h4(state.emptySubtitle),
    ]),
  ]);
}

function view(state$, name) {
  return state$.map(state => {
    if (state.progress < 1 && state.items.length === 0) {
      return renderDataTable({...state, items: placeholderData}, name);
    } else if (state.items.length === 0) {
      return renderEmpty(state, name);
    } else {
      return renderDataTable(state, name);
    }
  });
}

export default view;
