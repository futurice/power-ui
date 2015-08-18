import React from 'react';
import Spinner from './Spinner';


export default class PeopleTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidUpdate(){
        if (this.props.people){
            $('table-data-table').dataTable({
              'paging': false,
               'info': false,
               'stateSave': true,
               // Keep state for 5 mins
               'stateDuration': 5 * 60,
               'order': [],
               'language': {
                 'sSearch': '',
                 'searchPlaceholder': 'Filter',
               },
               'bDestroy': true,
            });
        }
    }

    render() {
        if (!this.props.people)
            return (
                <Spinner />
            );
        return (
            <table className="table table-striped table-data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Tribe</th>
                        <th>Skills</th>
                        <th>Current projects</th>
                        <th>Unused UTZ in [month] </th>
                        <th>[ Timeline here ] </th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.people.map((p) => {
                        return (
                            <tr key={p.id}>
                                <td>{p.name}</td>
                                <td>{p.tribe}</td>
                                <td>{p.skills}</td>
                                <td>{p.current_projects}</td>
                                <td>{p.unused_utz_in_month}</td>
                                <td>{p.timeline}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }
}
