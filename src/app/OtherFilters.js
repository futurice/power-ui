import React from 'react';
import TextFilter from './TextFilter';
import AvailabilityFilter from './AvailabilityFilter';
import TimeRangeFilter from './TimeRangeFilter';



export default class OtherFilters extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <h1>Filter tools</h1>
                <TextFilter />
                <AvailabilityFilter />
                <TimeRangeFilter />
            </div>
        );
    }
}
