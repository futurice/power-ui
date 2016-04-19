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
import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';

// The array represents the order and the numbers in it represent tribe id.
// so tribe id=1 will be first, tribe id=7 will be last.
const DEFAULT_TRIBE_ORDER = [1, 5, 6, 2, 4, 3, 9, 7];

function TribeFilter(state$, DOM) {
  const props$ = state$
    .map(state => {
      const tribeOrder = state.tribeOrder || DEFAULT_TRIBE_ORDER;
      const rearrangedTribes = state.tribes.reduce((list, tribe) => {
        const idx = tribeOrder.indexOf(tribe.id);
        if (idx === -1) {
          list.push(tribe);
        } else {
          list[idx] = tribe;
        }
        return list;
      }, new Array(tribeOrder.length)).filter(tribe => typeof tribe !== 'undefined');

      return {
        location: state.filters.location,
        tribes: rearrangedTribes,
      };
    });
  return LocationFilter({DOM, props$});
}

export {TribeFilter};
