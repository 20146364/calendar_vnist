import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import * as $ from 'jquery';
import 'select2';
import { Options } from 'select2';

@Component({
  selector: 'app-mytodo',
  templateUrl: './mytodo.component.html',
  styleUrls: [
    './mytodo.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MytodoComponent implements OnInit, OnDestroy {

  // select2 option
  public multipleOptions: Options;
  public singleOptions: Options;

  title = 'My list todo';

  categoriesSortBy: any[];

  // Sort by
  sortBy: any[];
  selectedSortBy: any[];

  // list Plants
  listPlants: any[];
  // selected plants
  selectedPlant: any[];

  // list categories
  Categories: any[];
  // selected categories
  selectedCategories: any[];

  // list due date statuses
  listDueDateStatuses: any[];
  // selected due date statuses
  selectedDueDateStatuses: any[];

  // creator and editor
  listCreatorEditor: any[];
  // selected creator and editor
  selectedCreatorEditor: any[];

  tickets: any[];

  constructor() { }

  ngOnInit() {

    this.multipleOptions = {
      width: '100%',
      multiple: true,
      tags: true
    };
    this.singleOptions = {
      width: '100%',
      tags: true
    };

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

    this.listPlants = [
      {
        'id': 1,
        'name': 'Ha Noi',
      },
      {
        'id': 2,
        'name': 'Hai Phong',
      },
      {
        'id': 3,
        'name': 'Da Nang',
      },
      {
        'id': 4,
        'name': 'Ho Chi Minh',
      },
    ];

    this.Categories = [
      {
        'id': 1,
        'name': 'Category 1',
      },
      {
        'id': 2,
        'name': 'Category 2',
      },
      {
        'id': 3,
        'name': 'Category 3',
      },
    ];

    this.listDueDateStatuses = [
      {
        'id': 1,
        'name': 'Not yet due',
      },
      {
        'id': 2,
        'name': 'Due',
      },
      {
        'id': 3,
        'name': 'Overdue',
      },
      {
        'id': 4,
        'name': 'Completed',
      },
    ];


    this.listCreatorEditor = [
      {
        'id': 1,
        'firstname': 'Kawasaki',
        'lastname': 'Dang Nhu'
      },
      {
        'id': 2,
        'firstname': 'Kimura',
        'lastname': 'Trinh Thien'
      },
      {
        'id': 3,
        'firstname': 'Yoshida',
        'lastname': 'Nguyen Van'
      },
      {
        'id': 4,
        'firstname': 'Nakama',
        'lastname': 'Pham Duc'
      },
    ];

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

    this.getSelectedPlants();
    this.getSelectedCategories();
    this.getSelectedDueDateStatuses();
    this.getSelectedCreatorEditor();
  }

  ngOnDestroy() {

    this.setSelectedPlants();
    this.setSelectedCategories();
    this.setSelectedDueDateStatuses();
    this.setSelectedCreatorEditor();
  }

  // get plants
  getSelectedPlants() {
    let myItem: any;
    let key;
    key = 'selectedPlant';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedPlant = myItem;
    }
  }
  // set plants
  setSelectedPlants() {
    let key;
    key = 'selectedPlant';
    localStorage.setItem(key, JSON.stringify(this.selectedPlant));
  }

  // get categories
  getSelectedCategories() {
    let myItem: any;
    let key;
    key = 'selectedCategories';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedCategories = myItem;
    }
  }
  // set categories
  setSelectedCategories() {
    let key;
    key = 'selectedCategories';
    localStorage.setItem(key, JSON.stringify(this.selectedCategories));
  }

  // get due date statuses
  getSelectedDueDateStatuses() {
    let myItem: any;
    let key;
    key = 'selectedDueDateStatuses';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedDueDateStatuses = myItem;
    }
  }
  // set due date statuses
  setSelectedDueDateStatuses() {
    let key;
    key = 'selectedDueDateStatuses';
    localStorage.setItem(key, JSON.stringify(this.selectedDueDateStatuses));
  }

  // get creator and editor
  getSelectedCreatorEditor() {
    let myItem: any;
    let key;
    key = 'selectedCreatorEditor';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedCreatorEditor = myItem;
    }
  }
  // set creator and editor
  setSelectedCreatorEditor() {
    let key;
    key = 'selectedCreatorEditor';
    localStorage.setItem(key, JSON.stringify(this.selectedCreatorEditor));
  }

  // // filter plants
  // filterPlantMultiple(event) {
  //   let query;
  //   query = event.query;
  //   this.plantService.getPlants().then(plants => {
  //     this.filteredPlantsMultiple = this.filterPlant(query, plants);
  //   });
  // }

  // filterPlant(query, plants: any[]): any[] {
  //   let filtered;
  //   filtered = [];
  //   for ( let i = 0; i < plants.length; i++) {
  //     let plant;
  //     plant = plants[i];
  //     if ( plant.name.toLowerCase().indexOf(query.toLowerCase() ) === 0) {
  //       filtered.push(plant);
  //     }
  //   }
  //   return filtered;
  // }

  // // filter Due date
  // filterDueDateStatusMultiple(event) {
  //   let query;
  //   query = event.query;
  //   this.dueDateService.getDueDates().then(dueDateStatuses => {
  //     this.filteredDueDateStatusMultiple = this.filterDueDateStatus(query, dueDateStatuses);
  //   });
  // }

  // filterDueDateStatus(query, dueDateStatuses: any[]): any[] {
  //   let filtered;
  //   filtered = [];
  //   for (let i = 0; i < dueDateStatuses.length; i++) {
  //     let status;
  //     status = dueDateStatuses[i];
  //     if (status.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
  //       filtered.push(status);
  //     }
  //   }
  //   return filtered;
  // }

  // // filter category
  // filterCategoriesMultiple(event) {
  //   let query;
  //   query = event.query;
  //   this.categoryService.getCategories().then(categories => {
  //     this.filteredCategoriesMultiple = this.filterCategories(query, categories);
  //   });
  // }

  // filterCategories(query, categories: any[]): any[] {
  //   let filtered;
  //   filtered = [];
  //   for (let i = 0; i < categories.length; i++) {
  //     let category;
  //     category = categories[i];
  //     if (category.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
  //       filtered.push(category);
  //     }
  //   }
  //   return filtered;
  // }

  // // filter Creator and changed person
  // filterCreatorChangedMultiple(event) {
  //   let query;
  //   query = event.query;
  //   this.creatorChangedService.getCreatorChangeds().then(creatorChangeds => {
  //     this.filteredCreatorChangedMultiple = this.filterCreatorChanged(query, creatorChangeds);
  //   });
  // }

  // filterCreatorChanged(query, creatorChangeds: any[]): any[] {
  //   let filtered;
  //   filtered = [];
  //   for (let i = 0; i < creatorChangeds.length; i++) {
  //     let creatorChanged;
  //     creatorChanged = creatorChangeds[i];
  //     if (creatorChanged.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
  //       filtered.push(creatorChanged);
  //     }
  //   }
  //   return filtered;
  // }

}
