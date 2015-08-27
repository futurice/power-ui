import React from 'react';
import Spinner from './Spinner';

export default class TribeFilter extends React.Component {
  render() {
    if (!this.props.tribes) {
      return (
        <Spinner />
      );
    }
    return (
      <div className="tribefilter">
        <button
          className={this.props.selectedTribe === null ? 'active' : 'inactive'}
          onClick={this.props.onChange.bind(this, null)}>Show all</button>
        <button
          className={this.props.selectedTribe === 'Helsinki' ? 'active' : 'inactive'}
          onClick={this.props.onChange.bind(this, 'Helsinki')}>Helsinki</button>
        <button
          className={this.props.selectedTribe === 'Germany' ? 'active' : 'inactive'}
          onClick={this.props.onChange.bind(this, 'Germany')}>Germany</button>
        {this.props.tribes.map((t) => {
          return (
            <button
              className={this.props.selectedTribe === t.name ? 'active' : 'inactive'}
              key={t.id}
              onClick={this.props.onChange.bind(this, t.name)}
              value={t.name}
              >
              {t.name}
            </button>
          );
        })}
      </div>
    );
  }
}
