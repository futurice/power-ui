import React from 'react';

export default class AvailabilityFilter extends React.Component {
  render() {
    return (
      <div className="availabilityfilter">
        <p> Available for</p>
        <input
          type="num"
          maxLength="2"
          className="filter-input-field"
          id="availabilityFilterInputField"
          value={ this.props.availabilityFilterValue }
          onChange={this.props.onChange.bind(this)}
          />
        <span>MD</span>
      </div>
    );
  }
}
