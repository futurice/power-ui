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
      headers: {
        'Content-Type': 'application/json',
      },
    };
  },

  isTruthy(x) {
    return !!x;
  },
};
