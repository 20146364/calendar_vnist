import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import * as moment from 'moment';
import { CalendarService} from "../services/calendar.service"
import * as crypto from 'crypto-js';
import { Config } from "../services/config"
import { ViewEncapsulation } from '@angular/core';

// import {MenuItem,TreeNode} from 'primeng/components/common/api';
// import {TicketsService} from '../services/tickets.service'
import {PlantService} from '../services/plant.service'
import {CategoryService} from '../services/category.service'
import {PeopleService} from '../services/people.service'

interface Ticket {
  name: string,
  value: string
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {
  
  //Tickets tree
  // calendarTicketsTree: TreeNode[];

  // selectedCalendarTicketsTree: TreeNode[];

  //show my timesheet in fullcalendar
  myTimeSheetChecked: boolean = false;

  //plants list
  plantsList: any[];

  //people todo list
  peopleToDosList: any[];

  //categories todo list
  categoriesToDosList: any[];

  //people tickets list
  peopleTicketsList: any[];

  //categories tickets list
  categoriesTicketsList: any[];

  //people SCs list
  peopleSCsList: any[];

  //categories SCs list
  categoriesSCsList: any[];

  //people Outage list
  peopleOutagesList: any[];

  //categories Outage list
  categoriesOutagesList: any[];

  //suggestions people list
  filteredPlantsMultiple: any[];

  //suggestions people list
  filteredPeopleMultiple: any[];

  //suggestions categories list
  filteredCategoriesMultiple: any[];
  

  // Calendar Tickets
  calendarTickets: Ticket[];
  selectedCalendarTickets: Ticket[];

  // calendar's status
  calendarStatus: Ticket[];

  // Selected Service Call calendar
  selectedSCTickets: Ticket[];

  // Selected Todos calendar
  selectedTDTickets: Ticket[];

  // Selected Todos Plant
  selectedToDosStatus: any[];

  // Selected Tickets Plant
  selectedTicketsStatus: any[];

  // Selected SCs Plant
  selectedSCsStatus: any[];

  // Selected Outages Plant
  selectedOutagesStatus: any[];

  //plant's status
  plantStatus: any[];

  title: string = "Calendar View";

  //Event
  events: any[];

  header: any;

  event: MyEvent;

  dialogVisible = false;
  dialogNewVisible= false;
  idGen = 100;

  selectedEvent: any;
  selectedView: any;
  selectedDate: any;

  businessHours = {
    start: '6:00', // a start time (10am in this example)
    end: '20:00', // an end time (6pm in this example)

    dow: [ 1, 2, 3, 4, 5]
    // days of week. an array of zero-based day of week integers (0=Sunday)
    // (Monday-Thursday in this example)
  };
  options = {
    "firstDay" : 1,
    "showNonCurrentDates": false
  };
  // constructor(private nodeService: NodeService, private messageService: MessageService) { }

  // constructor(private calendarTicketsSrv: TicketsService, private calendarSrv: CalendarService, private router: Router) {
  constructor(private calendarSrv: CalendarService,
              private router: Router,
              private plantService: PlantService,
              private categoryService: CategoryService,
              private peopleService: PeopleService, ) {
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listMonth'
    };
    if (this.calendarSrv.getSelectedEvent() != 0) {
      this.selectedEvent = this.calendarSrv.getSelectedEvent();
      this.selectedView = this.selectedEvent.view.name;
      this.selectedDate = this.selectedEvent.calEvent.start.format();
    }
    // console.log(crypto.HmacSHA512('localhost:8765:15','88960fc4c89939f3653ecae729c94138731d00c0b3ef96b187026080123062d2'));
    // this.calendarSrv.getExampleData('POST').subscribe(data => {
    //     console.log('data');
    //   }, error => {
    //     console.log('error');
    //   })
  }

  ngOnInit() {
    this.events = [
      {
        'id': 1,
        'title': 'All Day Event',
        'start': '2018-11-11'
      },
      {
        'id': 2,
        'title': 'Long Event',
        'start': '2018-11-05',
        'end': '2018-11-02'
      },
      {
        'id': 3,
        'title': 'Event 12',
        'start': '2018-11-08',
        'className': 'highPriority'
      },
      {
        'id': 4,
        'title': 'Event Red',
        'start': '2018-11-16T16:06:00',
        'end': '2018-11-16T17:10:00',
        'color': 'red',
        'className': 'filter-italic'
      },
      {
        'id': 5,
        'title': 'Conference 3',
        'start': '2018-11-11',
        'end': '2018-11-13',
      },
      {
        'id': 6,
        'title': 'Conference 4',
        'start': '2018-11-25',
        'end': '2018-11-25',
      },
      {
        'id': 7,
        'title': 'Conference 4',
        'start': '2018-11-24T8:00:00',
        'end': '2018-11-24T16:00:00',
      },
      {
        'id': 8,
        'title': 'Conference 5',
        'start': '2018-11-23T10:00:00',
        'end': '2018-11-23T17:00:00',
      }

    ];

    this.calendarTickets = [
      {name: 'My TimeSheet', value: 'This is my calendar'},
    ];

    this.calendarStatus = [
      {name: 'Planted SCs', value: 'This is Planted SCs'},
      {name: 'Started SCs', value: 'This is Started SCs'},
      {name: 'Completed SCs', value: 'This is Completed SCs'},
    ];

    this.plantStatus = [
      {name: 'Planted ToDos', value: 'This is Planted ToDos'},
      {name: 'Started ToDos', value: 'This is Started ToDos'},
      {name: 'Completed ToDos', value: 'This is Completed ToDos'},
    ];

    // this.calendarTicketsSrv.getMyCalendarTickets().then(files => this.calendarTicketsTree = files);
  }

  handleDayClick(event) {
    //let offset = new Date().getTimezoneOffset();
    // console.log(offset);
    // console.log(event.date.subtract(offset, 'minutes'));
    // this.event.start = event.date.add(offset, 'minutes').toDate();
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
    if (e.view.name === 'month') {
      //start.stripTime();
    }

    if (end) {
      //end.stripTime();
      this.event.end = end.format();
    }

    this.event.id = e.calEvent.id;
    this.event.start = start.format();
    this.event.allDay = e.calEvent.allDay;
    this.dialogVisible = true;

  }

  saveEvent() {
    let offset = new Date().getTimezoneOffset();
    // update or new
    if (this.event.id) {
      let index: number = this.findEventIndexById(this.event.id);
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
    let index: number = this.findEventIndexById(this.event.id);
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
    let offset = new Date().getTimezoneOffset();
    console.log(eventData);
  }

  gotoDate(event, selectedDate){
    let date = new Date(event);
    selectedDate.gotoDate(date);
  }



  //filter plants
  filterPlantMultiple(event) {
    let query = event.query;
    this.plantService.getPlants().then(plants => {
      this.filteredPlantsMultiple = this.filterPlant(query, plants);
    });
  }

  filterPlant(query, plants: any[]):any[] {
    let filtered : any[] = [];
    for(let i = 0; i < plants.length; i++) {
      let plant = plants[i];
      if(plant.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(plant);
      }
    }
    return filtered;
  }

  //filter people
  filterPeopleMultiple(event) {
    let query = event.query;
    this.peopleService.getPeople().then(people => {
      this.filteredPeopleMultiple = this.filterPerson(query, people);
    });
  }

  filterPerson(query, people: any[]):any[] {
    let filtered : any[] = [];
    for(let i = 0; i < people.length; i++) {
      let person = people[i];
      if(person.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(person);
      }
    }
    return filtered;
  }

  //filter category
  filterCategoryMultiple(event) {
    let query = event.query;
    this.categoryService.getCategories().then(categories => {
      this.filteredCategoriesMultiple = this.filterCategory(query, categories);
    });
  }

  filterCategory(query, categories: any[]):any[] {
    let filtered : any[] = [];
    for(let i = 0; i < categories.length; i++) {
      let category = categories[i];
      if(category.name.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(category);
      }
    }
    return filtered;
  }

}

export class MyEvent {
  id: number;
  title: string;
  start: string;
  end: any;
  allDay = true;
  color: string;
  className: string;
}
