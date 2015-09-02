import {Rx} from '@cycle/core';

function interpret(DOM) {
  return {
    toggleSortCriteria$: Rx.Observable.merge(
      DOM.select('.column-sort-name').events('click').map(() => 'name'),
      DOM.select('.column-sort-tribe').events('click').map(() => 'tribe'),
      DOM.select('.column-sort-skills').events('click').map(() => 'skills'),
      DOM.select('.column-sort-project').events('click').map(() => 'project'),
      DOM.select('.column-sort-unused-utz').events('click').map(() => 'unused-utz')
    ),
  };
}

export default interpret;
