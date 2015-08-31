/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from '../hooks';
import {inputFieldStyle} from '../styles/common';
hJSX();

const textFilterStyle = {
  'display': 'inline-block',
};

function TextFilter(sources) {
  const value$ = sources.DOM
    .select('.TextFilter .filter-input-field')
    .events('input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <div className="TextFilter" style={textFilterStyle}>
      <p>Find a person or specific skills</p>
      <input
        type="text"
        className="filter-input-field"
        style={inputFieldStyle}
        placeholder="Add filter"
        data-hook={new ControlledInputHook(props.value)}
        />
    </div>
  );

  const sinks = {
    DOM: vtree$,
    value$,
  };
  return sinks;
}

export default TextFilter;
