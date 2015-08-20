import polyfill from 'babel/polyfill';
import React from 'react/addons';
import Router, {Route, RouteHandler} from 'react-router';
import * as stores from './app/Stores';


// Views
import PeoplePage from './app/PeoplePage';
import ProjectsPage from './app/ProjectsPage';
import PowerheadPage from './app/PowerheadPage';

const URL_ROOT = '/api/v1';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tribes: null,
            people: null,
            projects: null
        };
    }
    renderTribes(res) {
        if (this.state.tribes) {
            var newState = React.addons.update(this.state, {
                tribes : {
                    $push : res.data.results
                }
            });
            this.setState(newState);
        }
        else
            this.setState({tribes: res.data.results});
    }

    renderPeople(res) {
        if (this.state.people) {
            var newState = React.addons.update(this.state, {
                people : {
                    $push : res.data.results
                }
            });
            this.setState(newState);
        }
        else
            this.setState({people: res.data.results});
    }

    renderProjects(res) {
        if (this.state.projects) {
            var newState = React.addons.update(this.state, {
                projects : {
                    $push : res.data.results
                }
            });
            this.setState(newState);
        }
        else
            this.setState({projects: res.data.results});
    }

    componentDidMount() {
        stores.getNextPage(`${URL_ROOT}/tribes`, this.renderTribes.bind(this));
        stores.getNextPage(`${URL_ROOT}/people`, this.renderPeople.bind(this));
        stores.getNextPage(`${URL_ROOT}/projects`, this.renderProjects.bind(this));
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
