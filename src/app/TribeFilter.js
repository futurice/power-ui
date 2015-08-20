import React from 'react';
import Spinner from './Spinner';


export default class TribeFilter extends React.Component {
    onFilterByTribe(event) {
        $('.table-data-table').DataTable().columns(1).search( event.target.value ).draw();
    }
    render() {
        if(!this.props.tribes) {
            return (
                <Spinner />
            );
        }
        return (
            <div className="tribefilter">
                <button onClick={this.onFilterByTribe}>Show all</button>
                {this.props.tribes.map((t) => {
                    return <button key={t.id} onClick={this.onFilterByTribe} value={t.name}>{t.name}</button>;
                })}
            </div>
        );
    }
}
