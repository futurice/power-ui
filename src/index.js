import polyfill from 'babel/polyfill';
import React from 'react';
import Router, {Route, Link, RouteHandler} from 'react-router';

// Views
import People from './app/people.js';
import Projects from './app/projects.js';
import Powerhead from './app/powerhead.js';

console.log("Hello");

class App extends React.Component {
    render() {
        return <RouteHandler />;
    }
}

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="people" handler={People} />
        <Route name="projects" handler={Projects} />
        <Route name="powerhead" handler={Powerhead} />
    </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.querySelector('.content-wrapper'));
});