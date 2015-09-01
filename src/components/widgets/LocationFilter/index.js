/** @jsx hJSX */
import {hJSX} from '@cycle/dom';
import {smartStateFold} from 'power-ui/utils';
import buttonStyles from './locationFilterButton.scss';
hJSX();

function interpret(DOM) {
  return {
    selectLocation$: DOM.select('.LocationFilter button').events('click')
      .map(clickEv => clickEv.target.value)
      .startWith('all')
      .share(),
  };
}

function makeUpdate$(selectLocation$) {
  return selectLocation$
    .map(location => function updateLocation(oldState) {
      return {...oldState, location};
    });
}

function model(props$, update$) {
  return props$.flatMapLatest(props =>
    update$.startWith(props).scan(smartStateFold)
  );
}

function renderFilterButton(selectedLocation, label, value = label) {
  const className = selectedLocation === value
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
        {renderFilterButton(state.location, 'Show all', 'all')}
        {renderFilterButton(state.location, 'Helsinki')}
        {renderFilterButton(state.location, 'Germany', 'DE')}
        {renderFilterButtonsForTribes(state.location, state.tribes)}
      </div>
    );
  }).startWith(
    <div>Loading...</div>
  );
}

function LocationFilter(sources) {
  const actions = interpret(sources.DOM);
  const update$ = makeUpdate$(actions.selectLocation$);
  const state$ = model(sources.props$, update$);
  const vtree$ = view(state$);

  const sinks = {
    DOM: vtree$,
    value$: actions.selectLocation$,
  };
  return sinks;
}

export default LocationFilter;
