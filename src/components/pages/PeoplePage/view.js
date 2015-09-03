/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import renderNavBar from 'power-ui/components/widgets/nav-bar';
import styles from './styles.scss';
hJSX();

function view(locationFilterVTree$, textFilterVTree$,
              availabilityFilterVTree$, dataTableVTree$) {
  return Rx.Observable.combineLatest(
    locationFilterVTree$, textFilterVTree$, availabilityFilterVTree$, dataTableVTree$,
    (locationFilterVTree, textFilterVTree, availabilityFilterVTree, dataTableVTree) =>
      <div>
        {renderNavBar()}
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
              </div>
            </div>
          </div>
        </div>
        {dataTableVTree}
      </div>
    );
}

export default view;
