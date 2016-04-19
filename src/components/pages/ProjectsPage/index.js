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
import * as Rx from 'rx';
import {replicateStream} from 'power-ui/utils';
import makeDataTablePageHTTP from 'power-ui/components/pages/common/data-table-page-http';
import TextFilter from 'power-ui/components/widgets/TextFilter/index';
import DataTableWrapper from './data-table-wrapper';
import {model, filterState} from './model';
import view from './view';
import {TribeFilter} from 'power-ui/components/pages/common/filters';

function TextFilterWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      label: 'Customer/Project name',
      value: state.filters.search,
    }))
    .distinctUntilChanged(state => state.value);
  return TextFilter({DOM, props$});
}

function ProjectsPageHTTP(sources) {
  return makeDataTablePageHTTP('/projects/')(sources);
}

function intent(textFilterSinks) {
  return {
    setSearchFilter$: textFilterSinks.value$,
  };
}

function ProjectsPage(sources) {
  const proxyState$ = new Rx.ReplaySubject(1);
  const projectsPageHTTP = ProjectsPageHTTP({HTTP: sources.HTTP, props$: proxyState$});
  const proxyTextFilterSinks = {value$: new Rx.ReplaySubject(1)};
  const actions = intent(proxyTextFilterSinks);
  const state$ = model(projectsPageHTTP.response$, sources.props$, actions);
  const tribeFilter = TribeFilter(state$, sources.DOM);
  const textFilter = TextFilterWrapper(state$, sources.DOM);
  const filteredState$ = filterState(state$,
    tribeFilter.value$, textFilter.value$
  );
  const dataTable = DataTableWrapper(filteredState$, sources.DOM);
  const vtree$ = view(
    tribeFilter.DOM, textFilter.DOM, dataTable.DOM
  );
  const localStorageSink$ = tribeFilter.value$.map(location => ({location}));
  replicateStream(state$, proxyState$);
  replicateStream(textFilter.value$, proxyTextFilterSinks.value$);

  const sinks = {
    DOM: vtree$,
    HTTP: projectsPageHTTP.request$,
    LocalStorage: localStorageSink$,
  };
  return sinks;
}

export default ProjectsPage;
