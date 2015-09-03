/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from 'power-ui/hooks';
import styles from './styles.scss';

function AvailabilityFilter(sources) {
  const value$ = sources.DOM
    .select('.AvailabilityFilter input')
    .events('input')
    .map(ev => ev.target.value);
  const vtree$ = sources.props$.map(props =>
    <div className={`AvailabilityFilter ${styles.availabilityFilter}`}>
      <p>Available for</p>
      <input type="num" maxLength="2"
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
