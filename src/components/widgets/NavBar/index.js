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
import styles from './styles.scss';

function intent(DOM) {
  return {
    showDefaultTribeDropdown$: DOM.select('.settings').events('mouseenter'),
    hideDefaultTribeDropdown$: Rx.Observable.merge(
      DOM.select('.settings').events('mouseout'),
      DOM.select('.defaultTribeDropdown').events('mouseout')
    ).filter(ev => {
      debugger;
      return !!ev.target;
    }),
  };
}

function renderHeaderLink(selectedRoute, label, route = `/${label.toLowerCase()}`) {
  const className = route === selectedRoute
    ? styles.linkSelected
    : styles.linkNormal;
  return (
    <a className={className} href={`#${route}`}><span>{label}</span></a>
  );
}

function renderDefaultTribeDropdown() {
  return (
    <div className="defaultTribeDropdown">
      <ul>
        <li>Foo</li>
        <li>Bar</li>
        <li>Baz</li>
      </ul>
    </div>
  );
}

function view(route) {
  return (
    <nav className={styles.navBar}>
      <a className={styles.brandLogo} href="/">
        <img alt="Power logo" src="img/power_logo.svg" />
      </a>
      <span className={styles.versionTag}>Alpha</span>
      <ul className={styles.linkList}>
        <li>{renderHeaderLink(route, 'People')}</li>
        <li>{renderHeaderLink(route, 'Powerhead')}</li>
      </ul>
      <ul className={styles.toolsList}>
        <li>
          <img className="settings" alt="Settings" src="img/settings_icon.svg" />
        </li>
      </ul>
    </nav>
  );
}

function NavBar(sources) {
  const actions = intent(sources.DOM);
  // const state$ = model(sources.props$, actions);
  const vtree$ = sources.Route.map(view);

  const sinks = {
    DOM: vtree$,
    // defaultTribe$: state$,
  };
  return sinks;
}

export default NavBar;
