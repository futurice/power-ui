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

/* global GLOBAL, BACKEND_HOST */
// Normally BACKEND_HOST comes from webpack plugin, which is not used by test runners.
if (typeof GLOBAL !== 'undefined' && typeof GLOBAL['BACKEND_HOST'] === 'undefined') {
  GLOBAL['BACKEND_HOST'] = 'http://localhost:8000';
}

/* global  */
const API_PATH = `${BACKEND_HOST}/api/v1`;

export default {
  API_PATH: API_PATH,
  HOST: BACKEND_HOST,
};
