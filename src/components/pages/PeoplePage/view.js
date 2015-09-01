/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import renderNavBar from 'power-ui/components/widgets/nav-bar';
import renderDataTable from 'power-ui/components/widgets/DataTable/index';
import styles from './styles.scss';
hJSX();

function view(state$, locationFilterVTree$ = null, textFilterVTree$ = null,
              availabilityFilterVTree$ = null) {
  return state$.map(state => {
    return (
      <div>
        {renderNavBar()}
        <div className={styles.contentWrapper}>
          <h1>People</h1>
          <div className={styles.filtersContainer}>
            {locationFilterVTree$}
            <div className={styles.borderBottomLine}>
              <h3 className={styles.borderBottomLine}>Filter tools</h3>
              <div className={styles.filtersList}>
                {textFilterVTree$}
                <div className={styles.verticalSeparator}/>
                {availabilityFilterVTree$}
              </div>
            </div>
          </div>
        </div>
        {renderDataTable(state.people)}
      </div>
    );
  });
}

export default view;
