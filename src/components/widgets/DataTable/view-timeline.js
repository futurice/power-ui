/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import moment from 'moment';
import styles from './styles.scss';

const caseHeight = 25;
const caseHeightAndMargin = caseHeight + 3;

function renderMonthSeparators(indexArray) {
  return indexArray.map(i => {
    const style = {left: `${(i / indexArray.length) * 100}%`};
    return <div style={style} className={styles.monthSeparator}></div>;
  });
}

function renderNowMarker(timeFrame) {
  const totalTime = timeFrame.end.diff(timeFrame.start);
  const nowTime = moment().diff(timeFrame.start);
  const nowLeftPercentage = (nowTime / totalTime) * 100;
  const style = {left: `${nowLeftPercentage}%`};
  return (
    <div>
      <span className={styles.nowLabel} style={style}>Now</span>
      <div className={styles.nowSeparator} style={style}></div>
    </div>
  );
}

function renderMonthLabels(timeFrame, indexArray) {
  const monthLabelWidth = `${100 / indexArray.length}%`;
  return indexArray.map(i => {
    const monthName = timeFrame.start.clone().add(i, 'months').format('MMMM');
    const className = styles.timelineMonthLabel;
    const style = {
      'width': monthLabelWidth,
      'left': `${(i / indexArray.length) * 100}%`,
    };
    return <span className={className} style={style}>{monthName}</span>;
  });
}

function timeFrameIndexArray(timeFrame) {
  const months = timeFrame.end.diff(timeFrame.start, 'months') + 1;
  const array = [];
  for (let i = 0; i < months; i++) {
    array.push(i);
  }
  return array;
}

function renderTimelineHeader(timeFrame) {
  const indexArray = timeFrameIndexArray(timeFrame);
  return (
    <th className={styles.timelineColumnHeader}>
      {renderMonthLabels(timeFrame, indexArray)}
      {renderMonthSeparators(indexArray)}
      {renderNowMarker(timeFrame)}
    </th>
  );
}

function renderSingleCase(theCase, indexInList) {
  const liStyle = {
    'left': `${theCase.leftStart}%`,
    'top': `${indexInList * (caseHeightAndMargin)}px`,
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

function measureCaseWith(timeFrame) {
  const totalTime = timeFrame.end.diff(timeFrame.start);
  return function measureCase({start_date, end_date, label, opacity, type}) {
    const allocationStart = moment(start_date).diff(timeFrame.start);
    const allocationEnd = moment(end_date).diff(timeFrame.start);
    const leftStart = (Math.max(0, allocationStart) / totalTime) * 100;
    const leftEnd = (Math.min(totalTime, allocationEnd) / totalTime) * 100;
    const backgroundClass = type === 'allocation'
      ? styles.caseItemBackgroundAllocation
      : styles.caseItemBackgroundAbsence;
    return {leftStart, leftEnd, backgroundClass, label, opacity};
  };
}

function preprocessAllocationCase(allocation) {
  return {
    type: 'allocation',
    label: allocation.project.name,
    start_date: allocation.start_date,
    end_date: allocation.end_date,
    opacity: parseFloat(allocation.total_allocation),
  };
}

function preprocessAbsenceCase(absence) {
  return {
    type: 'absence',
    label: 'Absence',
    start_date: absence.start_date,
    end_date: absence.end_date,
    opacity: 1,
  };
}

function isCaseInTimeFrame(timeFrame) {
  return c => (
    moment(c.end_date).isAfter(timeFrame.start)
    && moment(c.start_date).isBefore(timeFrame.end)
  );
}

function renderTimelineCases(person, timeFrame) {
  const allocationCases = person.allocations.map(preprocessAllocationCase);
  const absenceCases = person.absences.map(preprocessAbsenceCase);
  const allCases = allocationCases.concat(absenceCases)
    .filter(isCaseInTimeFrame(timeFrame))
    .map(measureCaseWith(timeFrame))
    .map(renderSingleCase);
  const style = {height: `${allCases.length * (caseHeightAndMargin)}px`};
  return (
    <ul style={style} className={styles.casesList}>
      {allCases}
    </ul>
  );
}

export default {renderTimelineHeader, renderTimelineCases};
