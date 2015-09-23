/**
 * This file is part of power-ui, originally developed by Futurice Oy.
 *
 * power-ui is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
/** @jsx hJSX */
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
import styles from 'power-ui/components/pages/common/data-table-page-styles.scss';

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
