/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
hJSX();

const textFilterStyle = {
  'margin-left': '0.5em',
  'font-weight': 'normal',
  'border-radius': '5px',
  'border': '1px solid #d0d0d0',
  'padding': '3px',
};

function textFilter(sources) {
  const value$ = sources.DOM.get('.filter-input-field', 'input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <input
      type="text"
      className="filter-input-field"
      style={textFilterStyle}
      placeholder="Add filter"
      value={props.searchString}
      />
  );

  const sinks = {
    DOM: vtree$,
    value$,
  };
  return sinks;
}

export default textFilter;
