/**
 * This file is part of power-ui, originally developed by Futurice Oy.
 *
 * power-ui is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may
 * obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
import {Rx} from '@cycle/core';
import moment from 'moment';
import PeoplePage from 'power-ui/components/pages/PeoplePage/index';
import ProjectsPage from 'power-ui/components/pages/ProjectsPage/index';
import PowerheadPage from 'power-ui/components/pages/PowerheadPage/index';
import {mainHTTPRequest, mainHTTPResponse} from './http';
import view from './view';

function makeDataTablePageWrapper(Page) {
  return function DataTablePageWrapper(sources, tribes$) {
    const props$ = sources.LocalStorage.combineLatest(tribes$,
      ({location}, tribes) => ({
        location,
        tribes,
        // Bad approach: we should not need to pass props to the page
        availableTimeRange: {
          start: moment().startOf('month'),
          end: moment().clone().add(5, 'months').endOf('month'),
        },
      })
    );
    return Page({...sources, props$});
  };
}

function PowerheadPageWrapper(sources, tribes$) {
  const props$ = sources.LocalStorage.combineLatest(tribes$,
    ({location}, tribes) => ({
      location,
      tribes,
      // Bad approach: we should not need to pass props to the page
      reportLength: 3,
      lookaheadLength: 2,
    })
  );
  return PowerheadPage({...sources, props$});
}

function main(sources) {
  const tribes$ = mainHTTPResponse(sources.HTTP);
  const peoplePage = makeDataTablePageWrapper(PeoplePage)(sources, tribes$);
  const projectsPage = makeDataTablePageWrapper(ProjectsPage)(sources, tribes$);
  const powerheadPage = PowerheadPageWrapper(sources, tribes$);
  const request$ = mainHTTPRequest(
    peoplePage.HTTP, projectsPage.HTTP, powerheadPage.HTTP
  );
  const vtree$ = view(sources.Route,
    peoplePage.DOM, projectsPage.DOM, powerheadPage.DOM
  );
  const localStorageSink$ = Rx.Observable.merge(
    peoplePage.LocalStorage, projectsPage.LocalStorage, powerheadPage.LocalStorage
  );

  const sinks = {
    DOM: vtree$,
    HTTP: request$,
    LocalStorage: localStorageSink$,
  };
  return sinks;
}

export default main;
