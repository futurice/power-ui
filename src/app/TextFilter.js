import React from 'react';


export default class TextFilter extends React.Component {
    onSearch(event) {
        console.log(event.target.value);
        $('.table-data-table').DataTable().search( event.target.value ).draw();
    }
    render() {
        return (
            <div className="textfilter">
                <span> Find a person or specific skills </span>
                <input type="text" id="myInputTextField" onKeyUp={this.onSearch} />
            </div>
        );
    }
}
