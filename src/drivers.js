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

function hashRouteDriver() {
  return Rx.Observable.merge(
    Rx.Observable.just(window.location.hash.replace('#', '')),

    Rx.Observable.fromEvent(window, 'hashchange')
      .map(ev => ev.newURL.match(/\#[^\#]*$/)[0].replace('#', ''))
  );
}

function makeLocalStorageDriver(key) {
  return function localStorageDriver(payload$) {
    payload$ .subscribe(payload => {
      localStorage.setItem(key, JSON.stringify(payload));
    });

    return Rx.Observable.just(JSON.parse(localStorage.getItem(key)) || {});
  };
}

export default {hashRouteDriver, makeLocalStorageDriver};
