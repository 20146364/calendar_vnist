import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {PlantService} from '../services/plant.service';
import {CategoryService} from '../services/category.service';
import {DuedateService} from '../services/duedate.service';
import {CreatorchangedService} from '../services/creatorchanged.service';

@Component({
  selector: 'app-mytodo',
  templateUrl: './mytodo.component.html',
  styleUrls: [
    './mytodo.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MytodoComponent implements OnInit {

  title = 'My list todo';

  categoriesSortBy: any[];

  // Sort by
  sortBy: any[];
  selectedSortBy: any[];

  // plants list
  plantsList: any[];

  // categories todo list
  categoriesList: any[];

  // due date status todo list
  dueDateStatusList: any[];

  // creator and changed people tickets list
  creatorChangedList: any[];

  // suggestions people list
  filteredPlantsMultiple: any[];

  // suggestions people list
  filteredCategoriesMultiple: any[];

  // suggestions categories list
  filteredDueDateStatusMultiple: any[];

  // suggestions categories list
  filteredCreatorChangedMultiple: any[];

  tickets: any[];

  constructor(
              private plantService: PlantService,
              private categoryService: CategoryService,
              private dueDateService: DuedateService,
              private creatorChangedService: CreatorchangedService ) { }

  ngOnInit() {

    this.tickets = [{
      name: 'SC 1',
      type: 'SC',
      displaycontent: 'display of ticket 1',
      editcontent: 'edit of ticket 1',
      startcontent: 'start of ticket 1'
    },
    {
      name: 'Sc 2',
      type: 'SC',
      displaycontent: 'display of ticket 2',
      editcontent: 'edit of ticket 2',
      startcontent: 'start of ticket 2'
    },
    {
      name: 'SC 3',
      type: 'SC',
      displaycontent: 'display of ticket 3',
      editcontent: 'edit of ticket 3',
      startcontent: 'start of ticket 3'
    },
    {
      name: 'OT 4',
      type: 'OT',
      displaycontent: 'display of ticket 4',
      editcontent: 'edit of ticket 4',
      startcontent: 'start of ticket 4'
    },
    {
      name: 'OT 5',
      type: 'OT',
      displaycontent: 'display of ticket 5',
      editcontent: 'edit of ticket 5',
      startcontent: 'start of ticket 5'
    }];

    this.sortBy = [
      {
        id: 'dd',
        val: 'Due Date',
        label: 'Due Date'
      },
      {
        id: 'pl',
        val: 'Plant',
        label: 'Plant'
      },
      {
        id: 'colcb',
        val: 'Creator or last changed by',
        label: 'Creator or last changed by'
      }
    ];
  }

  // filter plants
  filterPlantMultiple(event) {
    let query;
    query = event.query;
    this.plantService.getPlants().then(plants => {
      this.filteredPlantsMultiple = this.filterPlant(query, plants);
    });
  }

  filterPlant(query, plants: any[]): any[] {
    let filtered;
    filtered = [];
    for ( let i = 0; i < plants.length; i++) {
      let plant;
      plant = plants[i];
      if ( plant.name.toLowerCase().indexOf(query.toLowerCase() ) === 0) {
        filtered.push(plant);
      }
    }
    return filtered;
  }

  // filter Due date
  filterDueDateStatusMultiple(event) {
    let query;
    query = event.query;
    this.dueDateService.getDueDates().then(dueDateStatuses => {
      this.filteredDueDateStatusMultiple = this.filterDueDateStatus(query, dueDateStatuses);
    });
  }

  filterDueDateStatus(query, dueDateStatuses: any[]): any[] {
    let filtered;
    filtered = [];
    for (let i = 0; i < dueDateStatuses.length; i++) {
      let status;
      status = dueDateStatuses[i];
      if (status.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(status);
      }
    }
    return filtered;
  }

  // filter category
  filterCategoriesMultiple(event) {
    let query;
    query = event.query;
    this.categoryService.getCategories().then(categories => {
      this.filteredCategoriesMultiple = this.filterCategories(query, categories);
    });
  }

  filterCategories(query, categories: any[]): any[] {
    let filtered;
    filtered = [];
    for (let i = 0; i < categories.length; i++) {
      let category;
      category = categories[i];
      if (category.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(category);
      }
    }
    return filtered;
  }

  // filter Creator and changed person
  filterCreatorChangedMultiple(event) {
    let query;
    query = event.query;
    this.creatorChangedService.getCreatorChangeds().then(creatorChangeds => {
      this.filteredCreatorChangedMultiple = this.filterCreatorChanged(query, creatorChangeds);
    });
  }

  filterCreatorChanged(query, creatorChangeds: any[]): any[] {
    let filtered;
    filtered = [];
    for (let i = 0; i < creatorChangeds.length; i++) {
      let creatorChanged;
      creatorChanged = creatorChangeds[i];
      if (creatorChanged.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(creatorChanged);
      }
    }
    return filtered;
  }
}
