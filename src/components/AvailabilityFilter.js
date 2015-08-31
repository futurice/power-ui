/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from '../hooks';
import {inputFieldStyle} from '../styles/common';
import spacing from '../styles/spacing';
import _ from 'lodash';
hJSX();

const availabilityFilterStyle = {
  'display': 'inline-block',
};

const availabilityFilterInputStyle = {
  'width': '35px',
  'text-align': 'center',
  'margin-right': spacing.small,
  'padding': spacing.tiny,
};

function AvailabilityFilter(sources) {
  const value$ = sources.DOM
    .select('.AvailabilityFilter .filter-input-field')
    .events('input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <div className="AvailabilityFilter" style={availabilityFilterStyle}>
      <p>Available for</p>
      <input
        type="num"
        maxLength="2"
        className="filter-input-field"
        style={_.merge({}, inputFieldStyle, availabilityFilterInputStyle)}
        data-hook={new ControlledInputHook(props.value)}
        />
      <span>MD</span>
    </div>
  );

  const sinks = {
    DOM: vtree$,
    value$,
  };
  return sinks;
}

export default AvailabilityFilter;
