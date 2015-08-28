/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {smartStateFold} from '../utils';
hJSX();

function renderFilterButton(selected, label, value = label) {
  return (
    <button
      className={selected === value ? 'active' : ''}
      value={value}
      >{label}</button>
  );
}

function renderFilterButtonsForTribes(selectedLocation, tribes) {
  return tribes.map(tribe =>
    renderFilterButton(selectedLocation, tribe.name)
  );
}

function view(state$) {
  return state$.map(state => {
    return (
      <div className="locationFilter">
        {renderFilterButton(state.selectedLocation, 'Show all', 'all')}
        {renderFilterButton(state.selectedLocation, 'Helsinki')}
        {renderFilterButton(state.selectedLocation, 'Germany', 'DE')}
        {renderFilterButtonsForTribes(state.selectedLocation, state.tribes)}
      </div>
    );
  }).startWith(
    <div>Loading...</div>
  );
}

function makeUpdate$(selectedLocation$) {
  return selectedLocation$
    .map(selectedLocation => function updateSelectedLocation(oldState) {
      return {...oldState, selectedLocation};
    });
}

function model(props$, update$) {
  return props$.flatMapLatest(props =>
    update$.startWith(props).scan(smartStateFold)
  );
}

function locationFilter(sources) {
  const selectedLocation$ = sources.DOM.get('.locationFilter button', 'click')
    .map(clickEv => clickEv.target.value)
    .startWith('all')
    .share();

  const update$ = makeUpdate$(selectedLocation$);
  const state$ = model(sources.props$, update$);

  const sinks = {
    DOM: view(state$),
    selectedLocation$,
  };
  return sinks;
}

export default locationFilter;
