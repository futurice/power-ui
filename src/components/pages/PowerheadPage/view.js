/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import styles from './styles.scss';

function view(state$, locationFilterVTree$) {
  return Rx.Observable.combineLatest(
    state$, locationFilterVTree$,
    (state, locationFilterVTree) =>
    <div>
      <div className={styles.contentWrapper}>
        <h1>Powerhead</h1>
        <div className={styles.filtersContainer}>
          {locationFilterVTree}
        </div>
      </div>
      graphs go here
      <div>
      {JSON.stringify(state)}
      </div>
    </div>
  );
}

export default view;
