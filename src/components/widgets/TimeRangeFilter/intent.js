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

function intent(DOM) {
  const rangeSlider1$ = DOM
    .select('.TimeRangeFilter input:nth-child(1)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  const rangeSlider2$ = DOM
    .select('.TimeRangeFilter input:nth-child(2)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)));

  return {rangeSlider1$, rangeSlider2$};
}

export default intent;
