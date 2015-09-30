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
import _ from 'lodash';
import moment from 'moment';
import styles from './styles.scss';
import {timeRangeIndexArray} from 'power-ui/utils';

const caseHeight = 25;
const laneHeightAndMargin = caseHeight + 3;

function renderMonthSeparators(indexArray) {
  return indexArray.map(i => {
    const style = {left: `${(i / indexArray.length) * 100}%`};
    return <div style={style} className={styles.monthSeparator}></div>;
  });
}

function renderNowMarker(timeRange) {
  const totalTime = timeRange.end.diff(timeRange.start);
  const nowTime = moment().diff(timeRange.start);
  if (nowTime < 0) {
    return null;
  }
  const nowLeftPercentage = (nowTime / totalTime) * 100;
  const style = {left: `${nowLeftPercentage}%`};
  return (
    <div>
      <span className={styles.nowLabel} style={style}>Now</span>
      <div className={styles.nowSeparator} style={style}></div>
    </div>
  );
}

function renderMonthLabels(timeRange, indexArray) {
  const monthLabelWidth = `${100 / indexArray.length}%`;
  return indexArray.map(i => {
    const monthName = timeRange.start.clone().add(i, 'months').format('MMMM');
    const className = styles.timelineMonthLabel;
    const style = {
      'width': monthLabelWidth,
      'left': `${(i / indexArray.length) * 100}%`,
    };
    return <span className={className} style={style}>{monthName}</span>;
  });
}

function renderTimelineHeader(timeRange) {
  const indexArray = timeRangeIndexArray(timeRange);
  return (
    <th className={styles.timelineColumnHeader}>
      {renderMonthLabels(timeRange, indexArray)}
      {renderMonthSeparators(indexArray)}
      {renderNowMarker(timeRange)}
    </th>
  );
}

function renderSingleCase(theCase, laneIndex) {
  const liStyle = {
    'left': `${theCase.leftStart}%`,
    'top': `${laneIndex * (laneHeightAndMargin)}px`,
    'height': `${caseHeight}px`,
    'width': `${theCase.leftEnd - theCase.leftStart}%`,
  };
  const bgStyle = {opacity: theCase.opacity};
  return (
    <li style={liStyle} className={styles.caseItem}>
      <div style={bgStyle} className={theCase.backgroundClass} />
      <span className={styles.caseItemLabel}>{theCase.label}</span>
    </li>
  );
}

// renderSingleLane :: [case] -> index -> [caseElem]
function renderSingleLane(theLane, indexInList) {
  return theLane.map(theCase => renderSingleCase(theCase, indexInList));
}

// intersect :: x1 -> x2 -> y1 -> y2 -> boolean
function intersect(a1, a2, b1, b2) {
  return a2 > b1 && b2 > a1;
}

// caseFitsToLane :: case -> [case] -> boolean
function caseFitsToLane(theCase, lane) {
  return !lane.some(laneItem =>
    intersect(laneItem.leftStart, laneItem.leftEnd, theCase.leftStart, theCase.leftEnd)
  );
}

// compactCases :: [case] -> [[case]]
function compactCases(cases) {
  const allocations = cases.filter(c => c.type === 'allocation');
  const absences = cases.filter(c => c.type !== 'allocation');

  const lanes = allocations.reduce((laneArray, theCase) => {
    let firstAvailableLane = _.find(laneArray, _.curry(caseFitsToLane)(theCase));
    if (typeof firstAvailableLane === 'undefined') {
      firstAvailableLane = [];
      laneArray.push(firstAvailableLane);
    }
    firstAvailableLane.push(theCase);
    return laneArray;
  }, []);

  // see if we can fit all absences to any existing single lane.
  const laneForAbsences = _.find(lanes, lane => {
    const fitsToLane = _.curryRight(caseFitsToLane)(lane);
    return absences.every(absenceCase => fitsToLane(absenceCase));
  });

  if (typeof laneForAbsences !== 'undefined') {
    absences.forEach(a => laneForAbsences.push(a));
  } else {
    lanes.push(absences);
  }

  return lanes;
}

function measureCaseWith(timeRange) {
  const totalTime = timeRange.end.diff(timeRange.start);
  return function measureCase({start_date, end_date, label, opacity, type}) {
    const allocationStart = moment(start_date).diff(timeRange.start);
    const allocationEnd = moment(end_date).add(1, 'day').diff(timeRange.start);
    const leftStart = (Math.max(0, allocationStart) / totalTime) * 100;
    const leftEnd = (Math.min(totalTime, allocationEnd) / totalTime) * 100;
    const backgroundClass = type === 'allocation'
      ? styles.caseItemBackgroundAllocation
      : styles.caseItemBackgroundAbsence;
    return {leftStart, leftEnd, backgroundClass, label, opacity, type};
  };
}

function isCaseInTimeRange(timeRange) {
  return c => (
    moment(c.end_date).isAfter(timeRange.start)
    && moment(c.start_date).isBefore(timeRange.end)
  );
}

function renderTimelineCases(item, timeRange) {
  const measuredCases = item.cases
    .filter(isCaseInTimeRange(timeRange))
    .map(measureCaseWith(timeRange));

  const lanes = compactCases(measuredCases).map(renderSingleLane);

  const style = {height: `${lanes.length * (laneHeightAndMargin)}px`};
  return (
    <ul style={style} className={styles.casesList}>
      {lanes}
    </ul>
  );
}

export default {renderTimelineHeader, renderTimelineCases};
