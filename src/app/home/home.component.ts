import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { CalendarService} from '../services/calendar.service';
import { PlantsService} from '../services/plants.service';
import * as crypto from 'crypto-js';
import { Config } from '../services/config';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import 'select2';
import { Options } from 'select2';

import { forEach } from '@angular/router/src/utils/collection';
import { HammerGestureConfig } from '@angular/platform-browser';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ja;q=0.7',
    'x-requested-with': 'XMLHttpRequest'
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
export class HomeComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {

  // select2 option
  public multipleOptions: Options;
  public singleOptions: Options;
  public multiplePlantsOptions: Options;

  // Participating People SCs
  listParticipatingPeople: any[];
  // selected people SCs
  selectedSCsPeople: any[];

  // services status
  ticketStatuses: any[];
  // selected SCs status
  selectedSCsStatus: any;
  // selected outage status
  selectedOutageStatus: any;

  // categories Outage
  outageCategories: any[];
  // selected categories Outage
  selectedOutageCategories: any[];

  // creator and editor
  listCreatorEditor: any[];
  // selected creator and editor
  selectedCreatorEditor: any[];

  // Plants list
  listPlants: any[];
  // selected plants
  selectedPlant: any[];

  // time start
  timeStart: Date;

  // time end
  timeEnd: Date;

  title = 'Calendar View';

  // Event
  events: any[];

  header: any;

  event: MyEvent;

  dialogVisible = false;
  dialogNewVisible = false;
  idGen = 100;

  selectedEvent: any;
  selectedView = 'month';
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
  constructor(private http: HttpClient,
              private calendarSrv: CalendarService,
              private plantsSrv: PlantsService,
              private router: Router) {
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

    // this.initPlantsList();
    // this.plantsSrv.getListPlants()
    // .subscribe(data => this.listPlants = data);
  }

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
    this.multiplePlantsOptions = {
      width: '100%',
      multiple: true,
      tags: true
    };
    // this.getPlants();
    this.initPlantsList();
    console.log('after init listPlants out:', this.listPlants);
    // this.listPlants = this.listPlant;
    // this.getLocalPlant();
    this.getSelectedSCsPeople();
    this.getSelectedSCsStatus();
    this.getSelectedOutageStatus();
    this.getSelectedOutageCategories();
    this.getSelectedCreatorEditor();
    this.getSelectedPlant();
    this.getSelectedTimeStart();
    this.getSelectedTimeEnd();
    console.log('oninit selected Plant:', this.selectedPlant);
    console.log('oninit creator and editor:', this.selectedCreatorEditor);

    this.ticketStatuses = [
      {
        'id': 1,
        'name': 'All statuses',
      },
      {
        'id': 2,
        'name': 'Planed',
      },
      {
        'id': 3,
        'name': 'Started',
      },
      {
        'id': 4,
        'name': 'Ended',
      },

    ];

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

    this.outageCategories = [
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

    this.listParticipatingPeople = [
      {
        'id': 1,
        'firstname': 'Thuy',
        'lastname': 'Dang Nhu'
      },
      {
        'id': 2,
        'firstname': 'Long',
        'lastname': 'Trinh Thien'
      },
      {
        'id': 3,
        'firstname': 'Duong',
        'lastname': 'Nguyen Van'
      },
      {
        'id': 4,
        'firstname': 'Hien',
        'lastname': 'Pham Duc'
      },
    ];

  }

  ngOnChanges() {

  }

  ngAfterViewInit() {
    console.log('onafterviewinit selected Plant:', this.selectedPlant);
    console.log('onafterviewinit creator and editor:', this.selectedCreatorEditor);
  }

  ngOnDestroy() {
    // this.setLocalPlant();

    this.setSelectedSCsPeople();
    this.setSelectedSCsStatus();
    this.setSelectedOutageStatus();
    this.setSelectedOutageCategories();
    this.setSelectedPlant();
    this.setSelectedCreatorEditor();
    this.setSelectedTimeStart();
    this.setSelectedTimeEnd();
    console.log('destroy selected Plant:', this.selectedPlant);
    console.log('destroy creator and editor:', this.selectedCreatorEditor);
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

  // async initPlantsList() {
  //   let plantslist;
  //   plantslist = [];
  //   plantslist = await fetch(Config.api_endpoint + 'plants/fetch', {
  //   'credentials': 'include',
  //   'headers': {
  //     'accept': 'application/json',
  //     'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ja;q=0.7',
  //     'x-requested-with': 'XMLHttpRequest'
  //   },
  //   'referrer': Config.api_endpoint + 'angular-calendar/',
  //   'referrerPolicy': 'no-referrer-when-downgrade',
  //   'body': null,
  //   'method': 'GET',
  //   'mode': 'cors'
  //   }).then(function(response) {
  //     return response.json();
  //   });
  //   this.listPlants = plantslist.data;
  // }


  // get plants
  getLocalPlant() {
    let myItem: any;
    let key;
    key = 'localPlant';
    // console.log('init:');
    // console.log('localStorage:', localStorage);

    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.listPlants = myItem;
    }
    // this.selectedPlant.push('item 1');
    // console.log('selected Plant:', this.selectedPlant);
  }
  // set plants
  setLocalPlant() {
    // this.selectedPlant.push('item 3');
    let key;
    // console.log('destroy:');
    // console.log('selected Plant:', this.selectedPlant);
    key = 'localPlant';
    localStorage.setItem(key, JSON.stringify(this.listPlants));
    // console.log('localStorage:', localStorage);
  }

  initPlantsList() {
    let myItem: any;
    let key;
    key = 'localPlant';
    // console.log('init:');
    // console.log('localStorage:', localStorage);
    myItem = sessionStorage.getItem('localPlant');
    if (myItem !== 'undefined' && myItem !== null) {
      console.log('Sao ko vao dayyyyy');
      this.listPlants = JSON.parse(myItem);
      console.log('list plant from session:', this.listPlants);
    } else {
      let plantList;
      plantList = this.http.get(Config.api_endpoint + 'plants/fetch', httpOptions);
      console.log('this is plant list out:', plantList);
      console.log('this is type of plant list out:', typeof plantList);

      plantList.subscribe(data => {
        this.listPlants = [];
        this.listPlants = data['data'];
        // this.setLocalPlant();
        sessionStorage.setItem('localPlant', JSON.stringify(this.listPlants));
        console.log('init sessionStorage in:', sessionStorage);
        console.log('service list plant data:', data['data']);
        console.log('service list plant:', this.listPlants);
      });
    }
    console.log('init sessionStorage out:', sessionStorage); // ok, test nheok
    // this.listPlants.push('item plant 1');
    console.log('this isss listPlants out:', this.listPlants);
    // this.listPlants = this.plantsSrv.getListPlants();
  }
  // getPlants(): void {
  //   this.plantsSrv.getListPlants().subscribe(listPlants => this.listPlants = listPlants);
  //   console.log('this isss listPlants');
  //   console.log(this.listPlants);
  // }

  // get SCs people
  getSelectedSCsPeople() {
    let myItem: any;
    let key;
    key = 'selectedSCsPeople';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedSCsPeople = myItem;
    }
  }
  // set SCs people
  setSelectedSCsPeople() {
    let key;
    key = 'selectedSCsPeople';
    localStorage.setItem(key, JSON.stringify(this.selectedSCsPeople));
  }

  // get SCs status
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
  // set SCs status
  setSelectedSCsStatus() {
    let key;
    key = 'selectedSCsStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedSCsStatus));
  }

  // get SCs status
  getSelectedOutageCategories() {
    let myItem: any;
    let key;
    key = 'selectedOutageCategories';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedOutageCategories = myItem;
    }
  }
  // set SCs status
  setSelectedOutageCategories() {
    let key;
    key = 'selectedOutageCategories';
    localStorage.setItem(key, JSON.stringify(this.selectedOutageCategories));
  }

  // get outage status
  getSelectedOutageStatus() {
    let myItem: any;
    let key;
    key = 'selectedOutageStatus';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      myItem = JSON.parse(myItem);
      this.selectedOutageStatus = myItem;
    }
  }
  // set outage status
  setSelectedOutageStatus() {
    let key;
    key = 'selectedOutageStatus';
    localStorage.setItem(key, JSON.stringify(this.selectedOutageStatus));
  }

  // get plants
  getSelectedPlant() {
    let myItem: any;
    let key;
    key = 'selectedPlant';
    console.log('get selected localStorage:', localStorage);

    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedPlant = myItem;
    }
  }
  // set plants
  setSelectedPlant() {
    let key;
    // console.log('destroy:');
    // console.log('selected Plant:', this.selectedPlant);
    key = 'selectedPlant';
    localStorage.setItem(key, JSON.stringify(this.selectedPlant));
    // console.log('localStorage:', localStorage);
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
    console.log('creator and editor:', this.selectedCreatorEditor);
  }
  // set creator and editor
  setSelectedCreatorEditor() {
    let key;
    console.log('creator and editor:', this.selectedCreatorEditor);
    key = 'selectedCreatorEditor';
    localStorage.setItem(key, JSON.stringify(this.selectedCreatorEditor));
  }

  // get time start
  getSelectedTimeStart() {
    let myItem: any;
    let key;
    key = 'selectedTimeStart';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      myItem = JSON.parse(myItem);
      this.timeStart = new Date(myItem);
    }
  }
  // set time start
  setSelectedTimeStart() {
    let key;
    key = 'selectedTimeStart';
    localStorage.setItem(key, JSON.stringify(this.timeStart));
  }

  // get time end
  getSelectedTimeEnd() {
    let myItem: any;
    let key;
    key = 'selectedTimeEnd';
    myItem = localStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      myItem = JSON.parse(myItem);
      this.timeEnd = new Date(myItem);
    }
  }
  // set time end
  setSelectedTimeEnd() {
    let key;
    key = 'selectedTimeEnd';
    localStorage.setItem(key, JSON.stringify(this.timeEnd));
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
