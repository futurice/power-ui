import React from 'react';
import Filters from './Filters';
import ProjectTable from './ProjectTable';


export default class ProjectsPage extends React.Component {
    render() {
        return (
            <div>
                <h1>Pageheader here</h1>
                <Filters tribes={ this.props.tribes } />
                <ProjectTable projects={ this.props.projects }/>
            </div>
        );
    }
}
