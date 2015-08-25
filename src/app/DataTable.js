import React from 'react';



export default class DataTable extends React.Component {
    componentDidMount() {

    }

    floatFormatter(cell, n) {
        var num = parseFloat(cell);
        if(num)
            return num.toFixed(n);
        return 0;
    }

    percentageFormatter(cell) {
        var num = parseFloat(cell);
        if(num)
            return num.toFixed(2) * 100 +'%';
        return "0%";
    }

    tableHeaders() {
        return (
            <tr>
                <th>Name</th>
                <th>Tribe</th>
                <th>man_days_available (hide me)</th>
                <th>Skills</th>
                <th>Current projects</th>
                <th>Unused UTZ in [month] </th>
                <th>[ Timeline here ] </th>
            </tr>
        );
    }


    tableRows() {
        if(this.props.people) {
            var people = this.props.people.map((p) => {
                return (
                   <tr key={p.id}>
                       <td>{p.name}</td>
                       <td>{p.tribe.name}</td>
                       <td>{this.floatFormatter(p.man_days_available, 2)}</td>
                       <td>{p.skills}</td>
                       <td>{p.current_projects}</td>
                       <td>{this.percentageFormatter(p.unused_utz_in_month)}</td>
                       <td>
                           {p.allocations.map((a) => {
                               return (
                                   <span key={a.id}>
                                       {a.project}{this.floatFormatter(a.total_allocation, 2)}
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
            });
            return people;
        }
    }

    tableFooters() {
        return (
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        );
    }


    render() {
        return (
            <div>
                <table>
                    <thead>
                        {this.tableHeaders()}
                    </thead>
                    {this.tableRows()}
                     <tfoot>
                        {this.tableFooters()}
                    </tfoot>
                </table>
            </div>
        );
    }
}
