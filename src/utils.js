// TODO replace this with a URL from environment variables
// once we start rendering this app server-side with Node.js.
const URL_ROOT = 'http://localhost:8000/api/v1';

// This function is supposed to be given as the argument a
// `scan` operation over a stream of state|updateFn. State is
// expected to be an object, and updateFn is a function that
// takes old state and produces new state.
function smartStateFold(prev, curr) {
  if (typeof curr === 'function') {
    return curr(prev);
  } else {
    return curr;
  }
}

export default {URL_ROOT, smartStateFold};
