import React from 'react';

export default class TextFilter extends React.Component {
    render() {
        return (
            <input
                type="text"
                className="filter-input-field"
                id="textFilterInputField"
                value={this.props.searchString}
                placeholder="Add filter"
                onChange={this.props.onChange.bind(this)}
            />
        );
    }
}
