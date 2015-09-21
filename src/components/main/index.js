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
import PeoplePage from 'power-ui/components/pages/PeoplePage/index';
import PowerheadPage from 'power-ui/components/pages/PowerheadPage/index';
import {mainHTTPRequest, mainHTTPResponse} from './http';
import view from './view';

function PeoplePageWrapper(sources, tribes$) {
  const props$ = tribes$.map(tribes => ({tribes}));
  return PeoplePage({...sources, props$});
}

function PowerheadPageWrapper(sources, tribes$) {
  const props$ = tribes$.map(tribes => ({tribes}));
  return PowerheadPage({...sources, props$});
}

function main(sources) {
  const tribes$ = mainHTTPResponse(sources.HTTP);
  const peoplePage = PeoplePageWrapper(sources, tribes$);
  const powerheadPage = PowerheadPageWrapper(sources, tribes$);
  const request$ = mainHTTPRequest(peoplePage.HTTP, powerheadPage.HTTP);
  const vtree$ = view(sources.Route, peoplePage.DOM, powerheadPage.DOM);

  const sinks = {
    DOM: vtree$,
    HTTP: request$,
  };
  return sinks;
}

export default main;
