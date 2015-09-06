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
