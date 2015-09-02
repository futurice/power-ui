/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import styles from './styles.scss';
hJSX();

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
    return (num.toFixed(2) * 100).toFixed(0) + '%';
  }
  return '0%';
}

function tableHeaders(timeFrame) {
  const s = styles.selectableColumnHeader;
  return (
    <tr>
      <th></th>
      <th className={`${s} column-sort-name`}>Name</th>
      <th className={`${s} column-sort-tribe`}>Tribe</th>
      <th className={`${s} column-sort-skills`}>Skills</th>
      <th className={`${s} column-sort-project`}>Project</th>
      <th className={`${s} column-sort-unused-utz`}>
        Unused UTZ in {timeFrame.start.format('MMMM')}
      </th>
      <th className={s}>[ Timeline here ] </th>
      <th></th>
    </tr>
  );
}

function tableRows(people) {
  if (people) {
    return people.map((p) =>
      <tr key={p.id}>
        <td></td>
        <td>{p.name}</td>
        <span style={{display: 'none'}}>{JSON.stringify(p)}</span>
        <td>{p.tribe.name}</td>
        <td>{p.skills}</td>
        <td>{p.current_projects.join(', ')}</td>
        <td>{percentageFormatter(p.unused_utz_in_month)}</td>
        <td>
          {p.allocations.map((a) => {
            return (
              <span key={a.id}>
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
        <td></td>
      </tr>
    );
  }
}

function view(props$) {
  return props$.map(({people, timeFrame}) =>
    <div className={styles.dataTable}>
      <table>
        <thead>
          {tableHeaders(timeFrame)}
        </thead>
        {tableRows(people)}
      </table>
    </div>
  );
}

export default view;
