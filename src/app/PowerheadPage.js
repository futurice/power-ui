import React from 'react';
import TribeFilter from './TribeFilter';
import PowerheadChart from './PowerheadChart';
import * as stores from './Stores';
import NavBar from './NavBar';
const URL_ROOT = 'http://localhost:8000/api/v1';

const HELSINKI = ['Vesa', 'Avalon', 'South Side'];
const GERMANY = ['Berlin', 'Lausanne'];


export default class PowerheadPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            powerheads: [],
            filtered: [],
            filters: {
                tribe: null,
            }
        };
    }

    componentDidMount() {
        if(!this.state.powerheads.length)
            stores.getNextPage(`${URL_ROOT}/powerhead`, this.renderPowerheads.bind(this));
    }

    renderPowerheads(res) {
        let newState = React.addons.update(this.state, {
            powerheads : {
                $push : res.data.results
            }
        });
        this.setState(newState);
        this.updateFiltering();
    }

    updateFiltering() {
        console.log(this.state.filters);
        let filtered = this.state.powerheads.filter((powerhead) => {
            return (
                this.state.filters.tribe === null
                || powerhead.name === this.state.filters.tribe
                || (this.state.filters.tribe === 'Helsinki' && HELSINKI.indexOf(powerhead.name) != -1)
                || (this.state.filters.tribe === 'Germany' && GERMANY.indexOf(powerhead.name) != -1)
            );
        });

        this.setState({filtered: filtered});
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
                <NavBar />
                <div className="center-content">
                    <div className="content-wrapper">
                        <h1>Powerhead</h1>
                        <div className="filters">
                            <TribeFilter tribes={ this.props.tribes } selectedTribe={ this.state.filters.tribe } onChange={this.filterByTribe.bind(this)} />
                        </div>
                        <PowerheadChart powerheads={ this.state.filtered } />
                    </div>
                </div>
            </div>
        );
    }
}
