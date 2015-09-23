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
import {formatAsPercentage} from 'power-ui/utils';
import DataTable from 'power-ui/components/widgets/DataTable/index';

function preprocessAllocationCase(allocation) {
  return {
    type: 'allocation',
    label: allocation.project.name,
    start_date: allocation.start_date,
    end_date: allocation.end_date,
    opacity: parseFloat(allocation.total_allocation),
  };
}

function preprocessAbsenceCase(absence) {
  return {
    type: 'absence',
    label: 'Absence',
    start_date: absence.start_date,
    end_date: absence.end_date,
    opacity: 1,
  };
}

function preprocessPersonForDataTable(person) {
  const allocationCases = person.allocations.map(preprocessAllocationCase);
  const absenceCases = person.absences.map(preprocessAbsenceCase);
  return {...person, cases: allocationCases.concat(absenceCases)};
}

function DataTableWrapper(state$, DOM) {
  const props$ = state$
    .map(state => ({
      items: state.people.map(preprocessPersonForDataTable),
      timeRange: state.timeRange,
      progress: state.progress,
      columns: [
        {name: 'name', label: 'Name', valueFn: person => person.name},
        {name: 'tribe', label: 'Tribe', valueFn: person => person.tribe.name},
        {name: 'skills', label: 'Skills', valueFn: person => person.skills},
        {
          name: 'project',
          label: 'Project',
          valueFn: person => person.current_projects.join(', '),
        },
        {
          name: 'unused-utz',
          label: `Unused UTZ in ${state.timeRange.start.format('MMMM')}`,
          valueFn: person => formatAsPercentage(person.unused_utz_in_month),
          sortValueFn: person => person.unused_utz_in_month,
        },
      ],
      defaultSortCriteria: '-unused-utz',
      emptyTitle: 'Nobody',
      emptySubtitle: 'Perhaps we should hire more people?',
    }));
  return DataTable({DOM, props$});
}

export default DataTableWrapper;
