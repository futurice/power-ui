import LocationFilter from 'power-ui/components/widgets/LocationFilter/index';

function LocationFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => {
      const tribeOrder = state.tribeOrder || [];
      const rearrangedTribes = state.tribes.reduce((list, tribe) => {
        const idx = tribeOrder.indexOf(tribe.id);
        if (idx === -1) {
          list.push(tribe);
        } else {
          list[idx] = tribe;
        }
        return list;
      }, new Array(tribeOrder.length)).filter(tribe => typeof tribe !== 'undefined');

      return {
        location: state.filters.location,
        tribes: rearrangedTribes,
      };
    });
  return LocationFilter({DOM, props$});
}

export default {LocationFilterWrapper};
