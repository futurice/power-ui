import React from 'react';
import PeopleTable from './PeopleTable';
import Filters from './Filters';


export default class PeoplePage extends React.Component {
    render() {
        return (
            <div>
                <h1>Pageheader here</h1>
                <Filters tribes={ this.props.tribes } />
                <PeopleTable people={ this.props.people }/>
            </div>
        );
    }
}
