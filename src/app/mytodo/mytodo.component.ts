import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {PlantService} from '../services/plant.service';
import {CategoryService} from '../services/category.service';
import {PeopleService} from '../services/people.service';

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
              private peopleService: PeopleService, ) { }

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

  // filter people
  filterDueDateStatusMultiple(event) {
    let query;
    query = event.query;
    this.peopleService.getPeople().then(people => {
      this.filteredDueDateStatusMultiple = this.filterPerson(query, people);
    });
  }

  filterPerson(query, people: any[]): any[] {
    let filtered;
    filtered = [];
    for (let i = 0; i < people.length; i++) {
      let person;
      person = people[i];
      if (person.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
        filtered.push(person);
      }
    }
    return filtered;
  }

  // filter category
  filterCategoryMultiple(event) {
    let query;
    query = event.query;
    this.categoryService.getCategories().then(categories => {
      this.filteredCategoriesMultiple = this.filterCategory(query, categories);
    });
  }

  filterCategory(query, categories: any[]): any[] {
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
}
