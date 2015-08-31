/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from '../hooks';
hJSX();

const textFilterStyle = {
  'margin-left': '0.5em',
  'font-weight': 'normal',
  'border-radius': '5px',
  'border': '1px solid #d0d0d0',
  'padding': '3px',
};

function TextFilter(sources) {
  const value$ = sources.DOM.get('.TextFilter', 'input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <input
      type="text"
      className="TextFilter"
      style={textFilterStyle}
      placeholder="Add filter"
      data-hook={new ControlledInputHook(props.searchString)}
      />
  );

  const sinks = {
    DOM: vtree$,
    value$,
  };
  return sinks;
}

export default TextFilter;
