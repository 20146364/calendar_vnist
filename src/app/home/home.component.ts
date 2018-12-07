import { Component, OnInit, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarService} from '../services/calendar.service';
import * as crypto from 'crypto-js';
import { Config } from '../services/config';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

//  import {MenuItem,TreeNode} from 'primeng/components/common/api';
//  import {TicketsService} from '../services/tickets.service';
import {PlantService} from '../services/plant.service';
import {CategoryService} from '../services/category.service';
import {PeopleService} from '../services/people.service';

const httpOptions = {
  headers: new HttpHeaders({
    'Accept':  'application/json'
  })
};

interface Ticket {
  name: string ;
  value: string ;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit, OnDestroy {

  // Tickets tree
  // calendarTicketsTree: TreeNode[];

  // selectedCalendarTicketsTree: TreeNode[];

  people: string[];

  // show my timesheet in fullcalendar
  myTimeSheetChecked = false;

  // plants list
  plantsList: any[];

  // people todo list
  peopleToDosList: any[];

  // categories todo list
  categoriesToDosList: any[];

  // people tickets list
  peopleTicketsList: any[];

  // categories tickets list
  categoriesTicketsList: any[];

  // people SCs list
  peopleSCsList: any[];

  // categories SCs list
  categoriesSCsList: any[];

  // people Outage list
  peopleOutagesList: any[];

  // categories Outage list
  categoriesOutagesList: any[];

  // suggestions people list
  filteredPlantsMultiple: any[];

  // suggestions people list
  filteredPeopleMultiple: any[];

  // suggestions categories list
  filteredCategoriesMultiple: any[];

  //  Calendar Tickets
  calendarTickets: Ticket[];
  selectedCalendarTickets: Ticket[];

  //  calendar's status
  calendarStatus: Ticket[];

  calendarToDosStatus: any[];
  calendarSCsStatus: any[];

  //  Selected Service Call calendar
  selectedSCTickets: Ticket[];

  //  Selected Todos calendar
  selectedTDTickets: Ticket[];

  //  Selected Todos Plant
  selectedToDosStatus: any[];

  //  Selected Tickets Plant
  selectedTicketsStatus: any[];

  //  Selected SCs Plant
  selectedSCsStatus: any[];

  //  Selected Outages Plant
  selectedOutagesStatus: any[];

  // plant's status
  plantStatus: any[];

  title = 'Calendar View';

  // Event
  events: any[];

  header: any;

  event: MyEvent;

  dialogVisible = false;
  dialogNewVisible = false;
  idGen = 100;

  selectedEvent: any;
  selectedView: any;
  selectedDate: any;

  businessHours = {
    start: '6:00', //  a start time (10am in this example)
    end: '20:00', //  an end time (6pm in this example)

    dow: [ 1, 2, 3, 4, 5]
    // days of week. an array of zero-based day of week integers (0=Sunday)
    // (Monday-Thursday in this example)
  };
  options = {
    'firstDay' : 1,
    'showNonCurrentDates': false,
  };
  // constructor(private nodeService: NodeService, private messageService: MessageService) { }

  // constructor(private calendarTicketsSrv: TicketsService, private calendarSrv: CalendarService, private router: Router) {
  constructor(private http: HttpClient,
              private calendarSrv: CalendarService,
              private router: Router,
              private plantService: PlantService,
              private categoryService: CategoryService,
              private peopleService: PeopleService, ) {
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
    if (this.calendarSrv.getSelectedEvent() !== 0) {
      this.selectedEvent = this.calendarSrv.getSelectedEvent();
      this.selectedView = this.selectedEvent.view.name;
      this.selectedDate = this.selectedEvent.calEvent.start.format();
    }
    //  console.log(crypto.HmacSHA512('localhost:15','88960fc4c89939f3653ecae729c94138731d00c0b3ef96b187026080123062d2'));
    //  this.calendarSrv.getExampleData('POST').subscribe(data => {
    //      console.log('data');
    //    }, error => {
    //      console.log('error');
    //    })
  }

  ngOnInit() {

    this.getPlantsList();
    this.getCategoriesToDosList();
    this.getPeopleToDosList();
    this.getCategoriesTicketsList();
    this.getPeopleTicketsList();
    this.getCategoriesSCsList();
    this.getPeopleSCsList();
    this.getCategoriesOutagesList();
    this.getPeopleOutagesList();
    this.getMyTimeSheetChecked();
    this.getSelectedSCTickets();
    this.getSelectedToDosStatus();
    this.getSelectedTicketsStatus();
    this.getSelectedSCsStatus();
    this.getSelectedOutagesStatus();
    this.getSelectedTDTickets();

    // this.doGet();

    this.events = [
      {
        'id': 1,
        'title': 'All Day Event',
        'start': '2018-12-11',
        'end': '2018-12-12'
      },
      {
        'id': 2,
        'title': 'Long Event',
        'start': '2018-12-05',
        'end': '2018-12-07'
      },
      {
        'id': 3,
        'title': 'Event 12',
        'start': '2018-12-08',
        'end': '2018-12-10',
        'className': 'highPriority'
      },
      {
        'id': 4,
        'title': 'Event Red',
        'start': '2018-12-16',
        'end': '2018-12-16',
        'color': 'red',
        'className': 'filter-italic'
      },
      {
        'id': 5,
        'title': 'Conference 3',
        'start': '2018-12-11',
        'end': '2018-12-13'
      },
      {
        'id': 6,
        'title': 'Conference 4',
        'start': '2018-12-25',
        'end': '2018-12-25'
      },
      {
        'id': 7,
        'title': 'Conference 4',
        'start': '2018-12-24',
        'end': '2018-12-24'
      },
      {
        'id': 8,
        'title': 'Conference 5',
        'start': '2018-12-23',
        'end': '2018-12-23'
      }

    ];

    this.calendarTickets = [
      {name: 'My TimeSheet', value: 'This is my calendar'}
    ];

    this.calendarToDosStatus = [
      {name: 'Planted To-Do\'s', value: 'This is Planted To-Do\'s'},
      {name: 'Started To-Do\'s', value: 'This is Started To-Do\'s'},
      {name: 'Completed To-Do\'s', value: 'This is Completed To-Do\'s'},
    ];

    this.calendarSCsStatus = [
      {name: 'Planted SCs', value: 'This is Planted SCs'},
      {name: 'Started SCs', value: 'This is Started SCs'},
      {name: 'Completed SCs', value: 'This is Completed SCs'},
    ];

    this.plantStatus = [
      {name: 'Not yet due (blue)', value: 'Not yet due'},
      {name: 'Due (yellow, orange)', value: 'Due'},
      {name: 'Overdue (red)', value: 'Overdue'},
      {name: 'Completed (green)', value: 'Completed'},
    ];

    //  this.calendarTicketsSrv.getMyCalendarTickets().then(files => this.calendarTicketsTree = files);
  }

  ngOnDestroy() {

    this.setPlantsList();
    this.setCategoriesToDosList();
    this.setPeopleToDosList();
    this.setCategoriesTicketsList();
    this.setPeopleTicketsList();
    this.setCategoriesSCsList();
    this.setPeopleSCsList();
    this.setCategoriesOutagesList();
    this.setPeopleOutagesList();
    this.setMyTimeSheetChecked();
    this.setSelectedSCTickets();
    this.setSelectedToDosStatus();
    this.setSelectedTicketsStatus();
    this.setSelectedSCsStatus();
    this.setSelectedOutagesStatus();
    this.setSelectedTDTickets();
  }

  handleDayClick(event) {
    // // let offset = new Date().getTimezoneOffset();
    // //  console.log(offset);
    // //  console.log(event.date.subtract(offset, 'minutes'));
    // //  this.event.start = event.date.add(offset, 'minutes').toDate();
    this.event = new MyEvent();
    this.event.start = event.date.toDate();
    this.dialogNewVisible = true;
  }

  handleEventClick(e) {
    this.calendarSrv.setSelectedEvent(e);
    this.event = new MyEvent();
    this.event.title = e.calEvent.title;

    const start = e.calEvent.start;
    const end = e.calEvent.end;
    console.log(e.calEvent);
    if (e.view.name === 'month') {
      // start.stripTime();
    }

    if (end) {
      // end.stripTime();
      this.event.end = new Date(end);
    }

    this.event.id = e.calEvent.id;
     this.event.start = new Date(start);
    this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;

  }

  saveEvent() {
    let offset;
    offset = new Date().getTimezoneOffset();
    //  update or new
    if (this.event.id) {
      let index: number;
      index = this.findEventIndexById(this.event.id);
      if (index >= 0) {
        this.events[index] = this.event;
      }
    } else {
      this.event.id = this.idGen++;
      console.log(this.event.start);
      console.log(this.event.end);
      this.events.push(this.event);
      this.event = null;
    }

    this.dialogNewVisible = false;
  }

  editEvent(event) {
    this.router.navigate(['/detail', event.id]);
  }

  deleteEvent() {
    let index: number;
    index = this.findEventIndexById(this.event.id);
    if (index >= 0) {
      this.events.splice(index, 1);
    }
    this.dialogVisible = false;
  }

  findEventIndexById(id: number) {
    let index = -1;
    for (let i = 0; i < this.events.length; i++) {
      if (id === this.events[i].id) {
        index = i;
        break;
      }
    }

    return index;
  }

  fetchEvents(eventData) {
    console.log(eventData);
    Config.defaultView = eventData.view.name;
  }

  onSelectEnd(eventData) {
    let offset;
    offset = new Date().getTimezoneOffset();
    console.log(eventData);
  }

  gotoDate(event, selectedDate) {
    let date;
    date = new Date(event);
    selectedDate.gotoDate(date);
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
  filterPeopleMultiple(event) {
    let query;
    query = event.query;
    this.peopleService.getPeople().then(people => {
      this.filteredPeopleMultiple = this.filterPerson(query, people);
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

  doGet() {
    // let url;
    // url = 'http://localhost/people/fetch?ids=48';
    fetch('http://localhost/people/fetch?ids=48',
    {
      'credentials': 'include',
      'headers': {
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ja;q=0.7',
        'x-requested-with': 'XMLHttpRequest'
      },
      'referrer': 'http://localhost/calendar',
      'referrerPolicy': 'no-referrer-when-downgrade',
      'body': null,
      'method': 'GET',
      'mode': 'cors'
    }).then(function(response) {
      return response.json();
    }).then(function(myJson) {
    console.log(myJson);
    console.log(myJson.data[0].full_name);
    });
  }

  // get old fillter plants list
  getPlantsList() {
    let myItem: any;
    let key;
    key = 'plantsList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.plantsList = myItem;
    }
  }
  // set current fillter plants list
  setPlantsList() {
    let key;
    key = 'plantsList';
    localStorage.setItem(key, JSON.stringify(this.plantsList));
  }

  // get old fillter category todo list
  getCategoriesToDosList() {
    let myItem: any;
    let key;
    key = 'categoriesToDosList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.categoriesToDosList = myItem;
    }
  }
  // set current fillter category todo list
  setCategoriesToDosList() {
    let key;
    key = 'categoriesToDosList';
    localStorage.setItem(key, JSON.stringify(this.categoriesToDosList));
  }

  // get old fillter people todo list
  getPeopleToDosList() {
    let myItem: any;
    let key;
    key = 'peopleToDosList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.peopleToDosList = myItem;
    }
  }
  // set current fillter people todo list
  setPeopleToDosList() {
    let key;
    key = 'peopleToDosList';
    localStorage.setItem(key, JSON.stringify(this.peopleToDosList));
  }

  // get old fillter category tickets list
  getCategoriesTicketsList() {
    let myItem: any;
    let key;
    key = 'categoriesTicketsList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.categoriesTicketsList = myItem;
    }
  }
  // set current fillter category tickets list
  setCategoriesTicketsList() {
    let key;
    key = 'categoriesTicketsList';
    localStorage.setItem(key, JSON.stringify(this.categoriesTicketsList));
  }

  // get old fillter people tickets list
  getPeopleTicketsList() {
    let myItem: any;
    let key;
    key = 'peopleTicketsList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.peopleTicketsList = myItem;
    }
  }
  // set current fillter people tickets list
  setPeopleTicketsList() {
    let key;
    key = 'peopleTicketsList';
    localStorage.setItem(key, JSON.stringify(this.peopleTicketsList));
  }

  // get old fillter category SCs list
  getCategoriesSCsList() {
    let myItem: any;
    let key;
    key = 'categoriesSCsList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.categoriesSCsList = myItem;
    }
  }
  // set current fillter category SCs list
  setCategoriesSCsList() {
    let key;
    key = 'categoriesSCsList';
    localStorage.setItem(key, JSON.stringify(this.categoriesSCsList));
  }

  // get old fillter people SCs list
  getPeopleSCsList() {
    let myItem: any;
    let key;
    key = 'peopleSCsList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.peopleSCsList = myItem;
    }
  }
  // set current fillter people SCs list
  setPeopleSCsList() {
    let key;
    key = 'peopleSCsList';
    localStorage.setItem(key, JSON.stringify(this.peopleSCsList));
  }

  // get old fillter category outages list
  getCategoriesOutagesList() {
    let myItem: any;
    let key;
    key = 'categoriesOutagesList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.categoriesOutagesList = myItem;
    }
  }
  // set current fillter category outages list
  setCategoriesOutagesList() {
    let key;
    key = 'categoriesOutagesList';
    localStorage.setItem(key, JSON.stringify(this.categoriesOutagesList));
  }

  // get old fillter people outages list
  getPeopleOutagesList() {
    let myItem: any;
    let key;
    key = 'peopleOutagesList';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.peopleOutagesList = myItem;
    }
  }
  // set current fillter people outages list
  setPeopleOutagesList() {
    let key;
    key = 'peopleOutagesList';
    localStorage.setItem(key, JSON.stringify(this.peopleOutagesList));
  }

  // get old fillter My timesheet checkbox
  getMyTimeSheetChecked() {
    let myItem: any;
    let key;
    key = 'myTimeSheetChecked';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.myTimeSheetChecked = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setMyTimeSheetChecked() {
    let key;
    key = 'myTimeSheetChecked';
    localStorage.setItem(key, JSON.stringify(this.myTimeSheetChecked));
  }

  // get old fillter My timesheet checkbox
  getSelectedTDTickets() {
    let myItem: any;
    let key;
    key = 'selectedTDTickets';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedTDTickets = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedTDTickets() {
    let key;
    key = 'selectedTDTickets';
    localStorage.setItem(key, JSON.stringify(this.selectedTDTickets));
  }

  // get old fillter My timesheet checkbox
  getSelectedSCTickets() {
    let myItem: any;
    let key;
    key = 'selectedSCTickets';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedSCTickets = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedSCTickets() {
    let key;
    key = 'selectedSCTickets';
    localStorage.setItem(key, JSON.stringify(this.selectedSCTickets));
  }

  // get old fillter My timesheet checkbox
  getSelectedToDosStatus() {
    let myItem: any;
    let key;
    key = 'selectedToDosStatus';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedToDosStatus = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedToDosStatus() {
    let key;
    key = 'selectedToDosStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedToDosStatus));
  }

  // get old fillter My timesheet checkbox
  getSelectedTicketsStatus() {
    let myItem: any;
    let key;
    key = 'selectedTicketsStatus';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedTicketsStatus = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedTicketsStatus() {
    let key;
    key = 'selectedTicketsStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedTicketsStatus));
  }

  // get old fillter My timesheet checkbox
  getSelectedSCsStatus() {
    let myItem: any;
    let key;
    key = 'selectedSCsStatus';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedSCsStatus = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedSCsStatus() {
    let key;
    key = 'selectedSCsStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedSCsStatus));
  }

  // get old fillter My timesheet checkbox
  getSelectedOutagesStatus() {
    let myItem: any;
    let key;
    key = 'selectedOutagesStatus';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedOutagesStatus = myItem;
    }
  }
  // set current fillter My timesheet checkbox
  setSelectedOutagesStatus() {
    let key;
    key = 'selectedOutagesStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedOutagesStatus));
  }
}

export class MyEvent {
  id: number;
  title: string;
  start: Date;
  end: Date;
  allDay = true;
  color: string;
  className: string;
}
