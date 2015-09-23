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
import {Rx} from '@cycle/core';
import moment from 'moment';

const defaultProps$ = Rx.Observable.just({
  items: [],
  progress: 0,
  timeRange: {
    start: moment().startOf('month'),
    end: moment().clone().add(2, 'months').endOf('month'),
  },
  columns: [],
  defaultSortCriteria: '-',
  emptyTitle: 'Empty',
  emptySubtitle: '',
});

function makeSortKeyFn(sortProperty, columns) {
  return function sortKeyFn(item) {
    const correctColumn = columns.filter(column => column.name === sortProperty);
    if (correctColumn.length !== 1) {
      throw new Error(`Unable to sort DataTable on invalid property ${sortProperty}`);
    }
    if (typeof correctColumn[0].sortValueFn === 'function') {
      return correctColumn[0].sortValueFn(item);
    }
    const value = correctColumn[0].valueFn(item);
    if (typeof value === 'string') {
      return value.toLowerCase();
    }
  };
}

function sort(items, sortCriteria, columns) {
  const sortProperty = sortCriteria.substring(1);
  const shouldReverse = sortCriteria.charAt(0) === '-';
  const sortedItems = _.sortBy(items, makeSortKeyFn(sortProperty, columns));
  if (shouldReverse) {
    return sortedItems.slice().reverse();
  } else {
    return sortedItems;
  }
}

function reverseCriteria(criteria) {
  const isAscending = criteria.charAt(0) === '+';
  const ascendingCriteria = criteria.replace(/^(\+|\-|)/, '+');
  const descendingCriteria = criteria.replace(/^\+/, '-');
  return isAscending ? descendingCriteria : ascendingCriteria;
}

function model(props$, actions) {
  const sortCriteria$ = props$.first()
    .flatMap(props =>
      actions.toggleSortCriteria$.startWith(props.defaultSortCriteria)
    )
    .scan((prevCriteria, nextCriteria) => {
      if (prevCriteria.substring(1) === nextCriteria) {
        return reverseCriteria(prevCriteria);
      } else {
        return reverseCriteria(nextCriteria);
      }
    });

  return props$
    .combineLatest(defaultProps$,
      (props, defaultProps) => ({...defaultProps, ...props})
    )
    .combineLatest(sortCriteria$, (props, sortCriteria) => {
      return {
        items: sort(props.items, sortCriteria, props.columns),
        progress: props.progress,
        timeRange: props.timeRange,
        columns: props.columns,
        sortCriteria,
        emptyTitle: props.emptyTitle,
        emptySubtitle: props.emptySubtitle,
      };
    });
}

export default model;
