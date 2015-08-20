import React from 'react';


export default class TextFilter extends React.Component {
    onSearch(event) {
        console.log(event.target.value);
        $('.table-data-table').DataTable().search( event.target.value ).draw();
    }
    render() {
        return (
            <div className="textfilter">
                <p> Find a person or specific skills </p>
                <input type="text" id="textFilterInputField" placeholder="Add filter" onKeyUp={this.onSearch} />
            </div>
        );
    }
}
