import {Rx} from '@cycle/core';
import _ from 'lodash';
import moment from 'moment';
import {smartStateFold} from 'power-ui/utils';

const initialState = {
  reports: [],
  tribes: [],
  filters: {
    location: 'all',
  },
};

const initialTimeRange = {
  start: moment().startOf('month'),
  end: moment().clone().add(2, 'months').endOf('month'),
};

function makeUpdateFn$(powerheadData$, props$) {
  const updatePowerheadReports$ = powerheadData$
    .map(reports => function updateStateWithPeopleArray(oldState) {
      return {...oldState, reports};
    });

  const updateTribes$ = props$
    .map(tribes => function updateStateWithTribes(oldState) {
      return {...oldState, tribes};
    });

  return Rx.Observable.merge(updatePowerheadReports$, updateTribes$);
}

function model(powerheadData$, props$) {
  const update$ = makeUpdateFn$(powerheadData$, props$);
  const state$ = update$
    .startWith(initialState)
    .scan(smartStateFold)
    .shareReplay(1);
  return state$;
}

function modelTimeRange() {
  return Rx.Observable.just(initialTimeRange);
}

/**
 * Returns an Observable of filter functions, built from the value$ using
 * a criteria function built with criteriaFnFactory.
 * criteriaFnFactory :: value -> person -> Boolean
 */
function makeFilterFn$(value$, criteriaFnFactory) {
  return value$
    .map(value => {
      const criteriaFn = criteriaFnFactory(value);
      return function filterStateByCriteria(oldState) {
        const newReports = oldState.reports.filter(criteriaFn);
        return {...oldState, reports: newReports};
      };
    })
    .startWith(_.identity); // identity means "allow anything"
}

function makeFilterByLocationFn$(selectedLocation$) {
  return makeFilterFn$(selectedLocation$, location =>
    function filterStateByLocation(report) {
      return (
        location === 'all'
        || location === report.name
        || location === report.country
        || location === report.site
      );
    }
  );
}

function filterState(state$, location$) {
  const filterFn$ = makeFilterByLocationFn$(location$);
  const filteredState$ = Rx.Observable.combineLatest(state$, filterFn$,
    (state, filterFn) => filterFn(state)
  );
  return filteredState$;
}

export default {model, modelTimeRange, filterState};
