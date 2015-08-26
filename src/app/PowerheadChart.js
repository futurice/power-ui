import React from 'react';


export default class PowerheadChart extends React.Component {

    render() {
        return (
            <ul>
                {this.props.powerheads.map((p) => {
                    return (
                        <li key={p.id}>{p.name}</li>
                    );
                })}
            </ul>
        );
    }
}
