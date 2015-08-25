import React from 'react';
import TribeFilter from './TribeFilter';


export default class PowerheadPage extends React.Component {
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
                <h1>Powerhead</h1>
                <div className="filters">
                    <TribeFilter tribes={ this.props.tribes } selectedTribe={ this.state.filters.tribe } onChange={this.filterByTribe.bind(this)} />
                </div>
                More content
            </div>
        );
    }
}
