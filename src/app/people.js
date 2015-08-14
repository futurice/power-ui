import React from 'react';
import {getPeople} from './stores.js';

export default class People extends React.Component {
    constructor() {
        super();
        this.state = {
            persons: []
        };
    }

    componentDidMount() {
        getPeople()
            .then((res) => {
                this.setState({persons: res.data.results});
            });
    }

    render() {
        const persons = this.state.persons;
        return (
            <div>
                <h1>People</h1>
                <ul>
                {persons.map((p) => {
                    return <li>{p.name}</li>;
                })}
                </ul>
                <p>Lorem ipsum Voluptate ad nostrud irure ullamco pariatur Duis ut eiusmod Duis ex magna cupidatat sed ea labore.</p>                
            </div>
        );
    }
}
