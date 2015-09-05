/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {ControlledInputHook} from 'power-ui/hooks';
import styles from './styles.scss';

function AvailabilityFilter(sources) {
  const newValue$ = sources.DOM
    .select('.AvailabilityFilter input')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  const valueToReplaceInvalidInput$ = sources.DOM
    .select('.AvailabilityFilter input')
    .events('change')
    .map(ev => ev.target.value)
    .filter(val => isNaN(parseInt(val)) || val.length === 0)
    .map(() => '0');

  const state$ = sources.props$
    .map(({value}) => value)
    .distinctUntilChanged()
    .merge(valueToReplaceInvalidInput$);

  const vtree$ = state$.map(givenValue => {
    const value = givenValue || '0';
    return (
      <div className={`AvailabilityFilter ${styles.availabilityFilter}`}>
        <p>Available for</p>
        <input type="num" maxLength="2"
          data-hook={new ControlledInputHook(value)}
          />
        <span>MD</span>
      </div>
    );
  });

  const sinks = {
    DOM: vtree$,
    value$: newValue$,
  };
  return sinks;
}

export default AvailabilityFilter;
