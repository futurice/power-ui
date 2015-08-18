import React from 'react';
import TribeFilter from './TribeFilter';
import OtherFilters from './OtherFilters';


export default class Filters extends React.Component {
    render() {
        return (
            <div>
                <h2>TribeFilter</h2>
                <TribeFilter tribes={ this.props.tribes }/>
                <OtherFilters />
            </div>
        );
    }
}
