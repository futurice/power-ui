import React from 'react';
import * as stores from './Stores';
import Filters from './Filters';


export default class PowerheadPage extends React.Component {
    render() {
        return (
            <Filters tribes={ this.props.tribes }/>
        );
    }
}
