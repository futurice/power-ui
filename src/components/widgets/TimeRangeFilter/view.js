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
import moment from 'moment';
import _ from 'lodash';
import {ul, li, div, p, section, input} from '@cycle/dom';
import {safeCoerceToString} from 'power-ui/utils';
import styles from './styles.scss';
const timeRangeFilterStyle = safeCoerceToString(styles.timeRangeFilter);

function renderLabels(state) {
  const labels = _.range(state.selectableMonthCount)
    .map(m => state.availableTimeRange.start.clone()
    .add(m,'month').format('MMM'));
  if (state.availableTimeRange.start.format('YY-MM') === moment().format('YY-MM')) {
    labels[0] = 'Now';
  }
  return ul(labels.map(label =>
    li(label)
  ));
}

function calculateSliderStyle(state) {
  // This should be same as in palette.scss
  const colorGrayLighter = '#D8D8D8';

  const p1 = state.dynamicTimeRange.min / (state.selectableMonthCount - 1);
  const p2 = state.dynamicTimeRange.max / (state.selectableMonthCount - 1);

  return {
    backgroundImage: `-webkit-gradient(
      linear, left top, right top,
      from(${colorGrayLighter}),
      color-stop(${p1}, ${colorGrayLighter}),
      color-stop(${p1}, black),
      color-stop(${p2}, black),
      color-stop(${p2}, ${colorGrayLighter}),
      to(${colorGrayLighter})
    )`,
  };
}

function augmentStateWithMetadata(oldState) {
  const selectableMonthCount = oldState.availableTimeRange.end
    .diff(oldState.availableTimeRange.start, 'months');
  return {...oldState, selectableMonthCount};
}

function view(state$) {
  return state$
    .map(augmentStateWithMetadata)
    .map(state => {
      const max = state.selectableMonthCount - 1;
      return div(`.TimeRangeFilter.${timeRangeFilterStyle}`, [
        p('Within this time frame'),
        section([
          input({
            attrs: {type: 'range', min: '0', max, step: '1'},
            hook: {
              update: (old, {elm}) => {
                if (state.injectedTimeRange.min !== null) {
                  elm.value = state.injectedTimeRange.min;
                }
              },
            },
          }),
          input({
            style: calculateSliderStyle(state),
            attrs: {type: 'range', min: '0', max, step: '1'},
            hook: {
              update: (old, {elm}) => {
                if (state.injectedTimeRange.max !== null) {
                  elm.value = state.injectedTimeRange.max;
                }
              },
            },
          }),
          renderLabels(state),
        ]),
      ]);
    });
}

export default view;
