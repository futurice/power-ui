import React from 'react';
import TribeFilter from './TribeFilter';
import TextFilter from './TextFilter';
import DataTable from './DataTable';


export default class ProjectsPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            filters: {
                tribe: null,
            }
        };
    }

    updateFiltering() {
        console.log(this.state.filters);
    }

    filterByTribe(tribe) {
        this.setState({
            filters: {
                tribe: tribe,
            }
        }, this.updateFiltering);
    }

    render() {
        return (
            <div>
                <h1>Projects</h1>
                <div className="filters">
                    <TribeFilter tribes={ this.props.tribes } selectedTribe={ this.state.filters.tribe } onChange={this.filterByTribe.bind(this)} />
                </div>
                <p> WIP!</p>
            </div>
        );
    }
}
