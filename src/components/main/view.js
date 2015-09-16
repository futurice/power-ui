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
import {hJSX} from '@cycle/dom';
import {Rx} from '@cycle/core';
import renderNavBar from 'power-ui/components/widgets/NavBar/index';
import 'power-ui/styles/global.scss';

function selectPage(route, peopleVTree, powerheadVTree) {
  switch (route) {
  case '/powerhead': return powerheadVTree;
  default:
  case '/people': return peopleVTree;
  }
}

function view(route$, peopleVTree$, powerheadVTree$) {
  return Rx.Observable.combineLatest(route$, peopleVTree$, powerheadVTree$,
    (route, peopleVTree, powerheadVTree) =>
      <div>
        {renderNavBar(route)}
        {selectPage(route, peopleVTree, powerheadVTree)}
      </div>
  );
}

export default view;
