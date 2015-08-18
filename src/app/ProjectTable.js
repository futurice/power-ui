import React from 'react';
import Spinner from './Spinner';


export default class ProjectTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

/*    componentDidMount() {
        var self = this;
        $('table.mytable').dataTable({
            "fnDrawCallback": function() {
                self.forceUpdate();
            },
        });
    }*/

    /*componentDidUpdate(){
        $('table.mytable').dataTable({
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
    }*/

    render() {
        if (!this.props.projects)
            return (
                <Spinner />
            );
        return (
            <table className="table table-striped table-data-table">
                <thead>
                    <tr>
                        <th>Customer</th>
                        <th>Project</th>
                        <th>Budget</th>
                        <th>Sales price</th>
                        <th>Value creation in [month] / Total</th>
                        <th>Overrun in [month] / Total</th>
                        <th>Orderbook</th>
                        <th>Man days</th>
                        <th>Comments</th>
                        <th>Timeline</th>
                    </tr>
                </thead>
                <tbody>
                    {this.props.projects.map((p) => {
                        return (
                            <tr key={p.id}>
                                <td>{p.customer}</td>
                                <td>{p.name}</td>
                                <td>{p.sales_price}</td>
                                <td>{p.value_creation}</td>
                                <td>{p.overrun}</td>
                                <td>{p.orderbook}</td>
                                <td>{p.length_in_man_days}</td>
                                <td>{p.comments}</td>
                                <td>{p.timeline}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        )
    }
}
