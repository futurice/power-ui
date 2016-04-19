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
import * as Rx from 'rx';
import {div, h1, h3} from '@cycle/dom';
import styles from 'power-ui/components/pages/common/data-table-page-styles.scss';

function view(locationFilterVTree$, textFilterVTree$,
              availabilityFilterVTree$, timeRangeFilterVTree$, dataTableVTree$) {
  return Rx.Observable.combineLatest(
    locationFilterVTree$, textFilterVTree$, availabilityFilterVTree$,
    timeRangeFilterVTree$, dataTableVTree$,
    (locationFilterVTree, textFilterVTree, availabilityFilterVTree,
      timeRangeFilterVTree, dataTableVTree) =>
      div([
        div(`.${styles.contentWrapper}`, [
          h1('People'),
          div(`.${styles.filtersContainer}`, [
            locationFilterVTree,
            div(`.${styles.borderBottomLine}`, [
              h3(`.${styles.borderBottomLine}`, 'Filter tools'),
              div(`.${styles.filtersList}`, [
                textFilterVTree,
                div(`.${styles.verticalSeparator}`),
                availabilityFilterVTree,
                div(`.${styles.verticalSeparator}`),
                timeRangeFilterVTree,
              ]),
            ]),
          ]),
        ]),
        dataTableVTree,
      ])
    );
}

export default view;
