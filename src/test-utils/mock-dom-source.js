import {Rx} from '@cycle/core';

const emptyStream = Rx.Observable.empty();

function getEventsStreamForSelector(selectorConfig) {
  return function getEventsStream(eventType) {
    for (const key in selectorConfig) {
      if (selectorConfig.hasOwnProperty(key) && key === eventType) {
        return selectorConfig[key];
      }
    }
    return emptyStream;
  };
}

function mockDOMSource(configuration = {}) {
  return {
    select: function select(selector) {
      for (const key in configuration) {
        if (configuration.hasOwnProperty(key) && key === selector) {
          return {
            observable: emptyStream,
            events: getEventsStreamForSelector(configuration[key]),
          };
        }
      }
      return {
        observable: emptyStream,
        events: () => emptyStream,
      };
    },
  };
}

export default mockDOMSource;
