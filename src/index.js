import polyfill from 'babel/polyfill';
import React from 'react';
import Router, {Route, RouteHandler} from 'react-router';
import * as stores from './app/Stores';


// Views
import PeoplePage from './app/PeoplePage';
import ProjectsPage from './app/ProjectsPage';
import PowerheadPage from './app/PowerheadPage';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tribes: null,
            people: null,
            projects: null
        };
    }
    componentDidMount() {
        stores.getTribes()
            .then((res) => {
                console.log('Got tribes');
                this.setState({tribes: res.data.results});
            });
        stores.getPeople()
            .then((res) => {
                console.log('Got people');
                this.setState({people: res.data.results});
            });
        stores.getProjects()
            .then((res) => {
                console.log('Got projects');
                this.setState({projects: res.data.results});
            });
    }
    render() {
        return <RouteHandler tribes={this.state.tribes} people={this.state.people} projects={this.state.projects} />;
    }
}

var routes = (
    <Route name="app" path="/" handler={App}>
        <Route name="people" handler={PeoplePage} />
        <Route name="projects" handler={ProjectsPage} />
        <Route name="powerhead" handler={PowerheadPage} />
    </Route>
);

Router.run(routes, function (Handler) {
    React.render(<Handler/>, document.querySelector('.content-wrapper'));
});
