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
            <div className="tribefilter">
                <h3>Tribefilter</h3>
                {this.props.tribes.map((t) => {
                    return <button key={t.id}>{t.name}</button>;
                })}
            </div>
        );
    }
}
