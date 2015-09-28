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
import styles from './styles.scss';

function renderHeaderLink(selectedRoute, label, route = `/${label.toLowerCase()}`) {
  const className = route === selectedRoute
    ? styles.linkSelected
    : styles.linkNormal;
  return (
    <a className={className} href={`#${route}`}><span>{label}</span></a>
  );
}

function renderNavBar(route) {
  return (
    <nav className={styles.navBar}>
      <a className={styles.brandLogo} href="/">
        <img alt="Power logo" src="img/power_logo.svg" />
      </a>

      <span className={styles.versionTag}>Alpha</span>

      <ul className={styles.linkList}>
        <li>{renderHeaderLink(route, 'People')}</li>
        <li>{renderHeaderLink(route, 'Projects')}</li>
        <li>{renderHeaderLink(route, 'Powerhead')}</li>
      </ul>
    </nav>
  );
}

export default renderNavBar;
