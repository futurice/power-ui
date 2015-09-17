import {Rx} from '@cycle/core';

function intent(DOM) {
  const rangeSlider1$ = DOM
    .select('.TimeRangeFilter input:nth-child(1)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)))
    .startWith(0);

  const rangeSlider2$ = DOM
    .select('.TimeRangeFilter input:nth-child(2)')
    .events('input')
    .map(ev => parseInt(ev.target.value || '0'))
    .filter(val => !isNaN(parseInt(val)))
    .startWith(2);

  return {
    rangeChange$: Rx.Observable.combineLatest(
      rangeSlider1$, rangeSlider2$, (value1, value2) => {
      let min = value1;
      let max = value2;

      if (min > max) {
        [min,max] = [max,min];
      }

      return {min, max};
    }),
  };
}

export default intent;
