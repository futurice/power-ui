/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from 'power-ui/hooks';
import styles from './styles.scss';
hJSX();

function TextFilter(sources) {
  const value$ = sources.DOM
    .select('.TextFilter input')
    .events('input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <div className="TextFilter" style={styles.textFilter}>
      <p>Find a person or specific skills</p>
      <input type="text" placeholder="Add filter"
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
