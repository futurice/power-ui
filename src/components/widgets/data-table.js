/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import spacing from 'power-ui/styles/spacing';
import palette from 'power-ui/styles/palette';
import styles from './data-table.scss';
hJSX();

const fullWidthStyle = {
  'width': '100%',
};

const tableHeaderRowStyle = {
  'border-bottom': `2px solid ${palette.black}`,
};

const firstColumnStyle = {
  'padding-left': spacing.big,
};

const lastColumnStyle = {
  'padding-right': spacing.big,
};

function floatFormatter(cell, n) {
  const num = parseFloat(cell);
  if (num) {
    return num.toFixed(n);
  }
  return 0;
}

function percentageFormatter(cell) {
  const num = parseFloat(cell);
  if (num) {
    return num.toFixed(2) * 100 + '%';
  }
  return '0%';
}

function tableHeaders() {
  return (
    <tr style={tableHeaderRowStyle}>
      <th style={firstColumnStyle}>Name</th>
      <th>Tribe</th>
      <th>man_days_available (hide me)</th>
      <th>Skills</th>
      <th>Project</th>
      <th>Unused UTZ in [month]</th>
      <th style={lastColumnStyle}>[ Timeline here ] </th>
    </tr>
  );
}

function tableRows(people) {
  if (people) {
    return people.map((p) => {
      return (
       <tr key={p.id}>
         <td style={firstColumnStyle}>{p.name}</td>
         <td>{p.tribe.name}</td>
         <td>{floatFormatter(p.man_days_available, 2)}</td>
         <td>{p.skills}</td>
         <td>{p.current_projects}</td>
         <td>{percentageFormatter(p.unused_utz_in_month)}</td>
         <td style={lastColumnStyle}>
           {p.allocations.map((a) => {
             return (
               <span key={a.id}>
                 {JSON.stringify(a.project)}
                 {floatFormatter(a.total_allocation, 2)}
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
  }
}
function tableFooters() {
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

function renderDataTable(people) {
  return (
    <div className={styles.dataTable}>
      <table style={fullWidthStyle}>
        <thead>
          {tableHeaders()}
        </thead>
        {tableRows(people)}
        <tfoot>
          {tableFooters()}
        </tfoot>
      </table>
    </div>
  );
}

export default renderDataTable;
