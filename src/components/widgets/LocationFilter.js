/** @jsx hJSX */
import 'babel/polyfill';
import {hJSX} from '@cycle/dom';
import {smartStateFold} from 'power-ui/utils';
hJSX();

const locationFilterButtonStyle = {
  'border-radius': '8px',
  'padding': '6px 10px',
  'background': 'transparent',
  'margin-right': '8px',
  'border': 'solid 1px #D8D8D8',
  'outline': 'none',
};

const locationFilterButtonActiveStyle = {
  'background': '#000000',
  'color': '#D8D8D8',
};

function renderFilterButton(selected, label, value = label) {
  const style = {
    ...locationFilterButtonStyle,
    ...(selected === value ? locationFilterButtonActiveStyle : {}),
  };
  return (
    <button value={value} style={style}>{label}</button>
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

function LocationFilter(sources) {
  const selectedLocation$ = sources.DOM
    .select('.LocationFilter button')
    .events('click')
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

export default LocationFilter;
