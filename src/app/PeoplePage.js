import React from 'react/addons';
import TribeFilter from './TribeFilter';
import TextFilter from './TextFilter';
import AvailabilityFilter from './AvailabilityFilter';
import TimeRangeFilter from './TimeRangeFilter';
import DataTable from './DataTable';
import * as stores from './Stores';
const URL_ROOT = '/api/v1';

const HELSINKI = ['Vesa', 'Avalon', 'South Side']
const GERMANY = ['Berlin', 'Lausanne']


export default class PeoplePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            people: [],
            filtered: [],
            filters: {
                tribe: null,
                search: null,
                availability: null
            }
        };
    }

    componentDidMount() {
        if(!this.state.people.length)
            stores.getNextPage(`${URL_ROOT}/people`, this.renderPeople.bind(this));
    }

    renderPeople(res) {
        let newState = React.addons.update(this.state, {
            people : {
                $push : res.data.results
            }
        });
        this.setState(newState);
        this.updateFiltering();
    }

    updateFiltering() {
        console.log(this.state.filters);
        let filtered = this.state.people.filter((person) => {
            return (
                this.state.filters.tribe === null
                || person.tribe.name === this.state.filters.tribe
                || (this.state.filters.tribe === 'Helsinki' && HELSINKI.indexOf(person.tribe.name) != -1)
                || (this.state.filters.tribe === 'Germany' && GERMANY.indexOf(person.tribe.name) != -1)
            );
        });

        filtered = filtered.filter((person) => {
            return (
                this.state.filters.search === null || person.name.toLowerCase().indexOf(this.state.filters.search.toLowerCase()) != -1
                || person.skills.toLowerCase().indexOf(this.state.filters.search.toLowerCase()) != -1
            );
        });

        filtered = filtered.filter((person) => {
            return this.state.filters.availability === null || parseInt(person.man_days_available) >= this.state.filters.availability;
        });
        this.setState({filtered: filtered});
    }

    filterByTribe(tribe) {
        this.setState({
            filters: {
                tribe: tribe,
                search: this.state.filters.search,
                availability: this.state.filters.availability
            }
        }, this.updateFiltering);
    }

    filterByString(event) {
        this.setState({
            filters: {
                tribe: this.state.filters.tribe,
                search: event.target.value,
                availability: this.state.filters.availability
            }
        }, this.updateFiltering);
    }

    filterByAvailability(event) {
        let num = parseInt(event.target.value);
        if (isNaN(num))
            num = null;
        this.setState({
            filters: {
                tribe: this.state.filters.tribe,
                search: this.state.filters.search,
                availability: num
            }
        }, this.updateFiltering);
    }

    render() {
        return (
            <div>
                <h1>People</h1>
                <div className="filters">
                    <TribeFilter tribes={ this.props.tribes } selectedTribe={ this.state.filters.tribe } onChange={this.filterByTribe.bind(this)} />
                    <div className="filtertools bottom-border-line">
                        <h3 className="bottom-border-line">Filter tools</h3>
                        <div className="textfilter">
                            <p> Find a person or specific skills </p>
                            <TextFilter searchString={ this.state.filters.search } onChange={this.filterByString.bind(this)} />
                        </div>
                        <AvailabilityFilter availabilityFilterValue={this.state.filters.availability} onChange={this.filterByAvailability.bind(this)} />
                        <TimeRangeFilter />
                    </div>
                </div>

                <DataTable people={ this.state.filtered }/>
            </div>
        );
    }
}
