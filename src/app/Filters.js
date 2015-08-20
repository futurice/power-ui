import React from 'react';
import TribeFilter from './TribeFilter';
import OtherFilters from './OtherFilters';


export default class Filters extends React.Component {
    render() {
        return (
            <div className="filters">
                <TribeFilter tribes={ this.props.tribes }/>
                <OtherFilters />
            </div>
        );
    }
}
