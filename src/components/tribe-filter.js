/** @jsx hJSX */
import 'babel/polyfill';
import {Rx} from '@cycle/core';
import {hJSX} from '@cycle/dom';
hJSX();

function renderTribeButtonsAsArray(tribes, selectedTribe) {
  return tribes.map(tribe =>
    <button
      className={selectedTribe === tribe.name ? 'active' : 'inactive'}
      value={tribe.name}
      >
      {tribe.name}
    </button>
  );
}

function view(state$) {
  return state$.map(state => {
    return (
      <div className="tribefilter">
        <button
          className={state.selectedTribe === null ? 'active' : 'inactive'}
          value="all"
          >Show all</button>
        <button
          className={state.selectedTribe === 'Helsinki' ? 'active' : 'inactive'}
          value="Helsinki"
          >Helsinki</button>
        <button
          className={state.selectedTribe === 'Germany' ? 'active' : 'inactive'}
          value="Germany"
          >Germany</button>
        {renderTribeButtonsAsArray(state.tribes, state.selectedTribe)}
      </div>
    );
  }).startWith(
    <div>Loading...</div>
  );
}

function makeUpdate$(selectedTribe$) {
  return selectedTribe$
    .map(selectedTribe => function updateSelectedTribe(oldState) {
      return {...oldState, selectedTribe};
    });
}

function model(props$, update$) {
  return props$.combineLatest(update$, (props, update) => {
    return update(props);
  });
  // TODO why isn't this below working?
  // const state$ = props$
  //   .merge(update$)
  //   .scan((prev, curr) => {
  //     if (typeof curr === 'function') {
  //       return curr(prev);
  //     } else {
  //       return curr;
  //     }
  //   });
  // return state$;
}

function tribeFilter(sources) {
  const selectedTribe$ = sources.DOM.get('.tribefilter button', 'click')
    .map(clickEv => clickEv.target.value)
    .map(value => value === 'all' ? null : value)
    .startWith(null)
    .share();

  const update$ = makeUpdate$(selectedTribe$);
  const state$ = model(sources.props$, update$);

  const sinks = {
    DOM: view(state$),
    selectedTribe$,
  };
  return sinks;
}

export default tribeFilter;
