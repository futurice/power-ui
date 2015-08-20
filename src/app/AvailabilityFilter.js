import React from 'react';


export default class AvailabilityFilter extends React.Component {
    onFilterByAvailability(event) {
        $('.table-data-table').DataTable().columns(2).search( event.target.value ).draw();
    }
    render() {
        return (
            <div className="availabilityfilter">
                <p> Available for</p>
                <input type="num" maxLength="2" id="availabilityFilterInputField" onKeyUp={this.onFilterByAvailability} />
                <span>MD</span>
            </div>
        );
    }
}
