/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {smartStateFold} from 'power-ui/utils';
import buttonStyles from './locationFilterButton.scss';
hJSX();

function interpret(DOM) {
  return {
    selectedLocation$: DOM.select('.LocationFilter button').events('click')
      .map(clickEv => clickEv.target.value)
      .startWith('all')
      .share(),
  };
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

function renderFilterButton(selected, label, value = label) {
  const className = selected === value
    ? buttonStyles.active
    : buttonStyles.normal;
  return (
    <button value={value} className={className}>{label}</button>
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
      <div className="LocationFilter">
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

function LocationFilter(sources) {
  const actions = interpret(sources.DOM);
  const update$ = makeUpdate$(actions.selectedLocation$);
  const state$ = model(sources.props$, update$);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$,
    selectedLocation$: actions.selectedLocation$,
  };
  return sinks;
}

export default LocationFilter;
