import React from 'react';
import Spinner from './Spinner';


export default class TribeFilter extends React.Component {
    render() {
        if(!this.props.tribes) {
            return (
                <Spinner />
            );
        }
        return (
            <div>
                <ul>
                {this.props.tribes.map((t) => {
                    return <li key={t.id}>{t.name}</li>;
                })}
                </ul>
            </div>
        );
    }
}
