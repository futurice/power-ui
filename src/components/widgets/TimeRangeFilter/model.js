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

function inferSliderHandlebarLocations(injectTimeRange = false) {
  return function dateToHandlebarLocation(props) {
    const dynamicTimeRange = {
      min: props.selectedTimeRange.start.diff(props.availableTimeRange.start, 'months'),
      max: props.selectedTimeRange.end.diff(props.availableTimeRange.start, 'months'),
    };

    const injectedTimeRange = injectTimeRange
      ? _.clone(dynamicTimeRange) : {min: null, max: null};

    return {...props, dynamicTimeRange, injectedTimeRange};
  };
}

function inferIndex(props, rangeTime) {
  return rangeTime.diff(props.availableTimeRange.start, 'months');
}

function makeUpdateFn$(actions, props$) {
  return props$.flatMap(props => {
    const startIdx = inferIndex(props, props.selectedTimeRange.start);
    const endIdx = inferIndex(props, props.selectedTimeRange.end);

    return Rx.Observable.combineLatest(
      actions.rangeSlider1$.startWith(startIdx),
      actions.rangeSlider2$.startWith(endIdx),
      (value1, value2) => {
        return {min: Math.min(value1,value2), max: Math.max(value1,value2)};
      }
    ).map(selection => function updateTimeRange(oldState) {
      const timeRange = props.availableTimeRange;
      const selectedTimeRange = {
        start: timeRange.start.clone()
          .startOf('month').add(selection.min, 'months'),
        end: timeRange.start.clone()
          .startOf('month').add(selection.max, 'months').endOf('month'),
      };
      return {...oldState, selectedTimeRange};
    })
    .skip(1); // first update comes from initialization, which should be discarded.
  });
}

function dynamicState$(props$, updateFn$) {
  return updateFn$.withLatestFrom(props$, (updateFn, props) => updateFn(props));
}

function model(props$, actions) {
  const update$ = makeUpdateFn$(actions, props$);
  const state$ = Rx.Observable.concat(
    props$.first().map(inferSliderHandlebarLocations(true)),
    dynamicState$(props$, update$).map(inferSliderHandlebarLocations())
  );
  return state$;
}

export default model;
