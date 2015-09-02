import interpret from './interpret';
import model from './model';
import view from './view';

function DataTable(sources) {
  const actions = interpret(sources.DOM);
  const state$ = model(sources.props$, actions);
  const vtree$ = view(state$);

  return {DOM: vtree$};
}

export default DataTable;
