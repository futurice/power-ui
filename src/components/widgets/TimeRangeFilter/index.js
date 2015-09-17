/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import styles from './styles.scss';
import intent from './intent';
import moment from 'moment';
import _ from 'lodash';
import {Rx} from '@cycle/core';
import {ControlledInputHook} from 'power-ui/hooks';


function makeUpdate(rangeChange$) {
  return rangeChange$
    .map(timeRangeSelections => function updateTimeRange(oldState) {


      const labels = _.range(0,5).map(m => moment().add(m, 'months').format('MMM'));

      const range = {
        start: moment().startOf('month').add(timeRangeSelections.min, 'months'),
        end: moment().startOf('month').add(timeRangeSelections.max, 'months').endOf('month'),
      };

      const injectedTimeRange = {
        min: null,
        max: null,
      };

      return {...oldState, dynamicTimeRange: timeRangeSelections, labels, range,
        injectedTimeRange};
    });
}

function model(props$, update$) {
  return update$.withLatestFrom(props$, (updateFn, props) => updateFn(props));
}

function renderLabels(labels) {
  //TODO, rename first label to "Now".
  return (
    <ul>
      {labels.reduce((list, label) => {
        if (list.length) {
          list.push(<li/>);
        }
        list.push(<li>{label}</li>);
        return list;
      },[])}
    </ul>
  );
}

function TimeRangeFilter(sources) {
  const actions = intent(sources.DOM);

  const update$ = makeUpdate(actions.rangeChange$);

  const state$ = Rx.Observable.merge(
    sources.props$.first(),
    model(sources.props$, update$)
  );

  //view
  const vtree$ = state$.map(state => {

    //console.log(state);
   
    // This should be same as in palette.scss
    const colorGrayLighter = '#D8D8D8';

    const p1 = state.dynamicTimeRange.min / (state.labels.length - 1);
    const p2 = state.dynamicTimeRange.max / (state.labels.length - 1);

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
        <input style={sliderStyle} value={new ControlledInputHook(state.injectedTimeRange.min)} min="0" max={state.labels.length - 1} step="1" type="range" />
        <input style={sliderStyle} value={new ControlledInputHook(state.injectedTimeRange.max)} min="0" max={state.labels.length - 1} step="1" type="range" />
       {renderLabels(state.labels)}     
      </section>
    </div>
    )
    }
  );

  const sinks = {
    DOM: vtree$,
    value$: state$,
  };
  return sinks;
}

export default TimeRangeFilter;
