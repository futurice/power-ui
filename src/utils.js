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
export default {
  /**
   * smartStateFold is supposed to be given as the argument a
   * `scan` operation over a stream of state|updateFn. State is
   * expected to be an object, and updateFn is a function that
   * takes old state and produces new state.
   * Example:
   * --s0---fn1----fn2----s10------>
   *      scan(smartStateFold)
   * --s0---s1-----s2-----s10------>
   *
   * where s1 = fn1(s0)
   * where s2 = fn2(s1)
   */
  smartStateFold(prev, curr) {
    if (typeof curr === 'function') {
      return curr(prev);
    } else {
      return curr;
    }
  },

  urlToRequestObjectWithHeaders(url) {
    return {
      url: url,
      method: 'GET',
      accept: 'json',
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },

  formatAsPercentage(input) {
    const num = parseFloat(input);
    if (!isNaN(num)) {
      return (num.toFixed(2) * 100).toFixed(0) + '%';
    }
    return null;
  },

  formatAsFinancialsNumber(num) {
    // Suppose num is 1035024.29
    return String(Math.ceil(num))
      // '1035024'
      .split('')
      // ['1', '0', '3', '5', '0', '2', '4']
      .reverse()
      // ['4', '2', '0', '5', '3', '0', '1']
      .map((digit, i) => i % 3 === 2 ? ` ${digit}` : digit)
      // ['4', '2', ' 0', '5', '3', ' 0', '1']
      .reverse()
      // ['1', ' 0', '3', '5', ' 0', '2', '4']
      .join('');
      // '1 035 024'
  },

  EURO_SYMBOL: '\u20AC',

  timeRangeIndexArray(timeRange) {
    const months = timeRange.end.diff(timeRange.start, 'months') + 1;
    const array = [];
    for (let i = 0; i < months; i++) {
      array.push(i);
    }
    return array;
  },

  isTruthy(x) {
    return !!x;
  },

  // Coerces the val to String, but replaces the annoying 'undefined' with ''.
  safeCoerceToString(val) {
    if (typeof val === 'undefined') {
      return '';
    } else {
      return String(val);
    }
  },

  replicateStream(origin$, proxy$) {
    origin$.subscribe(proxy$.asObserver());
  },
};
