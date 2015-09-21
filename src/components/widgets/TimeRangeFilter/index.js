/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import styles from './styles.scss';
import moment from 'moment';
import _ from 'lodash';
import {Rx} from '@cycle/core';
import {ControlledInputHook} from 'power-ui/hooks';

function intent(DOM) {
  const rangeSlider1$ = DOM
    .select('.TimeRangeFilter input:nth-child(1)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  const rangeSlider2$ = DOM
    .select('.TimeRangeFilter input:nth-child(2)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  return {rangeSlider1$, rangeSlider2$};
}

function inferIndex(props, rangeTime) {
  return rangeTime.diff(props.availableTimeRange.start, 'months');
}

function makeUpdate(actions, props$) {
  return props$.flatMap(props => {
    const startIdx = inferIndex(props, props.selectedTimeRange.start);
    const endIdx = inferIndex(props, props.selectedTimeRange.end);

    return Rx.Observable.combineLatest(
      actions.rangeSlider1$.startWith(startIdx),
      actions.rangeSlider2$.startWith(endIdx),
      (value1, value2) => {
        return {min: Math.min(value1,value2), max: Math.max(value1,value2)};
      });
  })
  .map(selection => function updateTimeRange(oldState) {
    const selectedTimeRange = {
      start: moment().startOf('month').add(selection.min, 'months'),
      end: moment().startOf('month').add(selection.max, 'months').endOf('month'),
    };
    return {...oldState, selectedTimeRange};
  }).skip(1); // first update comes from initialization, which should be discarded.
}

function model(props$, update$) {
  return update$.withLatestFrom(props$, (updateFn, props) => updateFn(props));
}

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

function renderLabels(labels) {
  //TODO, rename first label to "Now".
  return (
    <ul>
      {labels.reduce((list, label) => {
        if (list.length > 0) {
          list.push(<li/>);
        }
        list.push(<li>{label}</li>);
        return list;
      },[])}
    </ul>
  );
}

function renderView(state$) {
  return state$.map(state => {
    // This should be same as in palette.scss
    const colorGrayLighter = '#D8D8D8';

    const selectableMonthCount
     = state.availableTimeRange.end.diff(state.availableTimeRange.start, 'months');

    const labels = _.range(selectableMonthCount)
      .map(m => state.availableTimeRange.start.clone()
      .add(m,'month').format('MMM'));

    const p1 = state.dynamicTimeRange.min / (selectableMonthCount - 1);
    const p2 = state.dynamicTimeRange.max / (selectableMonthCount - 1);

    const sliderStyle = {
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

    return (
      <div className={`TimeRangeFilter ${styles.timeRangeFilter}`}>
        <p>Within this time frame</p>
        <section>
          <input
            data-hook={new ControlledInputHook(state.injectedTimeRange.min)}
            min="0"
            max={selectableMonthCount - 1}
            step="1"
            type="range"
          />
          <input style={sliderStyle}
            data-hook={new ControlledInputHook(state.injectedTimeRange.max)}
            min="0"
            max={selectableMonthCount - 1}
            step="1"
            type="range"
          />
         {renderLabels(labels)}
        </section>
      </div>
    );
  });
}

function TimeRangeFilter(sources) {
  const actions = intent(sources.DOM);
  const update$ = makeUpdate(actions, sources.props$);
  const state$ = Rx.Observable.concat(
    sources.props$.first().map(inferSliderHandlebarLocations(true)),
    model(sources.props$, update$).map(inferSliderHandlebarLocations())
  );
  const vtree$ = renderView(state$);
  const sinks = {
    DOM: vtree$,
    value$: state$.debounce(100),
    // Time range change cause a lot of re-rendering.
  };
  return sinks;
}

export default TimeRangeFilter;
