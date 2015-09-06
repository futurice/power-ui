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
        <li>{renderHeaderLink(route, 'Powerhead')}</li>
      </ul>
    </nav>
  );
}

export default renderNavBar;
