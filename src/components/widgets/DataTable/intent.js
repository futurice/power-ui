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
import {Rx} from '@cycle/core';

function intent(DOM) {
  return {
    toggleSortCriteria$: Rx.Observable.merge(
      DOM.select('.column-sort-name').events('click').map(() => 'name'),
      DOM.select('.column-sort-tribe').events('click').map(() => 'tribe'),
      DOM.select('.column-sort-skills').events('click').map(() => 'skills'),
      DOM.select('.column-sort-project').events('click').map(() => 'project'),
      DOM.select('.column-sort-unused-utz').events('click').map(() => 'unused-utz')
    ),
    personNameClick$: DOM.select('.personName a').events('click')
      .map(ev => {
        ev.preventDefault();
        return {url: ev.target.href};
      }),
  };
}

export default intent;
