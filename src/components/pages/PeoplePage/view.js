/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import styles from './styles.scss';

function view(locationFilterVTree$, textFilterVTree$,
              availabilityFilterVTree$, timeRangeFilterVTree$, dataTableVTree$) {
  return Rx.Observable.combineLatest(
    locationFilterVTree$, textFilterVTree$, availabilityFilterVTree$,
    timeRangeFilterVTree$, dataTableVTree$,
    (locationFilterVTree, textFilterVTree, availabilityFilterVTree,
      timeRangeFilterVTree, dataTableVTree) =>
      <div>
        <div className={styles.contentWrapper}>
          <h1>People</h1>
          <div className={styles.filtersContainer}>
            {locationFilterVTree}
            <div className={styles.borderBottomLine}>
              <h3 className={styles.borderBottomLine}>Filter tools</h3>
              <div className={styles.filtersList}>
                {textFilterVTree}
                <div className={styles.verticalSeparator}/>
                {availabilityFilterVTree}
                <div className={styles.verticalSeparator}/>
                {timeRangeFilterVTree}
              </div>
            </div>
          </div>
        </div>
        {dataTableVTree}
      </div>
    );
}

export default view;
