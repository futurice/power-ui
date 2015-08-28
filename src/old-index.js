import 'babel/polyfill';
import React from 'react/addons';
import Router, {Route, RouteHandler} from 'react-router';
import * as stores from './app/Stores';

// Views
import PeoplePage from './app/PeoplePage';
import ProjectsPage from './app/ProjectsPage';
import PowerheadPage from './app/PowerheadPage';

const URL_ROOT = 'http://localhost:8000/api/v1';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tribes: null,
    };
  }
  renderTribes(res) {
    if (this.state.tribes) {
      var newState = React.addons.update(this.state, {
        tribes : {
          $push : res.data.results,
        },
      });
      this.setState(newState);
    }
    else
      this.setState({tribes: res.data.results});
  }

  componentDidMount() {
    stores.getNextPage(`${URL_ROOT}/tribes`, this.renderTribes.bind(this));
  }

  render() {
    return <RouteHandler tribes={this.state.tribes} />;
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
  React.render(<Handler/>, document.querySelector('.app-container'));
});
