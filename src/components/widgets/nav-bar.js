/** @jsx hJSX */
import {hJSX} from '@cycle/dom';

function renderUnfinishedParts() {
  return (
    <div id="navbar" className="collapse navbar-collapse">
      <ul className="nav navbar-nav">
        <li>
          <a href="#/people" role="button" aria-expanded="false">
            People
          </a>
        </li>

        <li>
          <a href="#/projects" role="button" aria-expanded="false">
            Projects
          </a>
        </li>

        <li>
          <a href="#/powerhead" role="button" aria-expanded="false">
            Powerhead
          </a>
        </li>
      </ul>

      <ul className="nav navbar-nav navbar-right">
        <li>
          <a href="#">
            <span className="glyphicon glyphicon-pencil"></span>
            <span className="visible-xs-inline">Edit data</span>
          </a>
        </li>
        <li className="dropdown">
          <a
            href="#"
            className="dropdown-toggle"
            data-toggle="dropdown"
            role="button"
            aria-expanded="false"
            >
            <span className="glyphicon glyphicon-cog"></span>
            <span className="visible-xs-inline">Settings</span>
          </a>

          <ul className="dropdown-menu" role="menu">
            <li>
              <form className="dropdown-menu-form">
                Default tribe:
                  <div className="radio">
                    <label>
                      <input type="radio" name="tribe" value=""
                        data-store-cookie="365" />
                      None
                    </label>
                  </div>
              </form>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">
            <span className="glyphicon glyphicon-question-sign"></span>
            <span className="visible-xs-inline">About</span>
          </a>
        </li>
      </ul>
    </div>
  );
}

function renderNavBar() {
  return (
    <nav id="header" className="navbar navbar-inverse navbar-fixed-top">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#navbar"
            >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand navbar-brand-logo" href="/">
            <img alt="supersheet" src="img/power_logo.svg" />
          </a>
        </div>

        {void renderUnfinishedParts()}
        <span style={{fontSize: '10px', color: 'white'}}>Alpha</span>
      </div>
    </nav>
  );
}

export default renderNavBar;
