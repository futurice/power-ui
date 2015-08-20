import React from 'react';
import Spinner from './Spinner';


export default class PeopleTable extends React.Component {
    componentDidMount(){
        if (this.props.people){
            $('.table-data-table').dataTable({
                'paging': false,
                'info': false,
                'searching': true,
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

    componentDidUpdate(){
        if (this.props.people){
            $('.table-data-table').dataTable({
                'paging': false,
                'info': false,
                'searching': true,
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
                                <td>{p.tribe.name}</td>
                                <td>{p.skills}</td>
                                <td>{p.current_projects}</td>
                                <td>{p.unused_utz_in_month}</td>
                                <td>
                                    {p.allocations.map((a) => {
                                        return (
                                            <span key={a.id}>
                                                {a.project}{a.total_allocation}
                                                {a.start_date} - {a.end_date}
                                            </span>
                                        );
                                    })}
                                    {p.absences.map((b) => {
                                        return (
                                            <span key={b.id}>
                                                {b.start_date} - {b.end_date}
                                            </span>
                                        );
                                    })}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tfoot>
            </table>
        )
    }
}
