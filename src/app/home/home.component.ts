import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import * as crypto from 'crypto-js';
import { Config } from '../services/config';
import { ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as $ from 'jquery';
import 'select2';
import { Options } from 'select2';

import { CalendarService} from '../services/calendar.service';
import { PlantsService} from '../services/plants.service';
import { ParticipatingPeopleService} from '../services/participating-people.service';
import { ServicecallOutageService} from '../services/servicecall-outage.service';
import {OutageCategoryService} from '../services/outage-category.service';
import {CreatorEditorService} from '../services/creator-editor.service';

import { IEvent } from '../models/event';
import { ServiceCall } from '../models/service-call';
import { Outage } from '../models/outage';

import { forEach } from '@angular/router/src/utils/collection';
import { HammerGestureConfig } from '@angular/platform-browser';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';
import { from } from 'rxjs';

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
  listEvents: any[];

  header: any;

  event: IEvent;

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
              private participatingPeopleSrv: ParticipatingPeopleService,
              private scotSrv: ServicecallOutageService,
              private otCategorySrv: OutageCategoryService,
              private creatorEditorSrv: CreatorEditorService,
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
    this.initListSCsOutage();
    this.initListPlants();
    this.initListParticipatingPeople();
    this.initListOutageCategories();

    this.getSelectedSCsPeople();
    this.getSelectedSCsStatus();
    this.getSelectedOutageStatus();
    this.getSelectedOutageCategories();
    this.getSelectedCreatorEditor();
    this.getSelectedPlant();
    this.getSelectedTimeStart();
    this.getSelectedTimeEnd();

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

    // this.events = [
    //   {
    //     'id': 1,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-11',
    //     'end': '2018-12-12',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 2,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-05',
    //     'end': '2018-12-07',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 3,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-08',
    //     'end': '2018-12-10',
    //     'className': 'highPriority',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 4,
    //     'title': 'Da Nang',
    //     'start': '2018-12-16',
    //     'end': '2018-12-16',
    //     'color': 'red',
    //     'className': 'filter-italic',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 5,
    //     'title': 'Da Nang',
    //     'start': '2018-12-11',
    //     'end': '2018-12-13',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 6,
    //     'title': 'Da Nang',
    //     'start': '2018-12-25',
    //     'end': '2018-12-25',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 7,
    //     'title': 'Hai Phong',
    //     'start': '2018-12-24',
    //     'end': '2018-12-24',
    //     'plant_id': '34'
    //   },
    //   {
    //     'id': 8,
    //     'title': 'hai Phong',
    //     'start': '2018-12-23',
    //     'end': '2018-12-23',
    //     'plant_id': '34'
    //   }
    // ];

    // this.listEvents = [
    //   {
    //     'id': 1,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-11',
    //     'end': '2018-12-12',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 2,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-05',
    //     'end': '2018-12-07',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 3,
    //     'title': 'Ha Noi',
    //     'start': '2018-12-08',
    //     'end': '2018-12-10',
    //     'className': 'highPriority',
    //     'plant_id': '12'
    //   },
    //   {
    //     'id': 4,
    //     'title': 'Da Nang',
    //     'start': '2018-12-16',
    //     'end': '2018-12-16',
    //     'color': 'red',
    //     'className': 'filter-italic',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 5,
    //     'title': 'Da Nang',
    //     'start': '2018-12-11',
    //     'end': '2018-12-13',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 6,
    //     'title': 'Da Nang',
    //     'start': '2018-12-25',
    //     'end': '2018-12-25',
    //     'plant_id': '23'
    //   },
    //   {
    //     'id': 7,
    //     'title': 'Hai Phong',
    //     'start': '2018-12-24',
    //     'end': '2018-12-24',
    //     'plant_id': '34'
    //   },
    //   {
    //     'id': 8,
    //     'title': 'hai Phong',
    //     'start': '2018-12-23',
    //     'end': '2018-12-23',
    //     'plant_id': '34'
    //   }
    // ];

    // this.listPlants = [
    //   {
    //     'id': 12,
    //     'name': 'ha Noi',
    //   },
    //   {
    //     'id': 23,
    //     'name': 'Da Nag',
    //   },
    //   {
    //     'id': 34,
    //     'name': 'hai Phong',
    //   },
    //   {
    //     'id': 42,
    //     'name': 'ho chi minh',
    //   },
    // ];

    // this.outageCategories = [
    //   {
    //     'id': 1,
    //     'name': 'Category 1',
    //   },
    //   {
    //     'id': 2,
    //     'name': 'Category 2',
    //   },
    //   {
    //     'id': 3,
    //     'name': 'Category 3',
    //   },
    // ];

    // this.listCreatorEditor = [
    //   {
    //     'id': 1,
    //     'firstname': 'Kawasaki',
    //     'lastname': 'Dang Nhu'
    //   },
    //   {
    //     'id': 2,
    //     'firstname': 'Kimura',
    //     'lastname': 'Trinh Thien'
    //   },
    //   {
    //     'id': 3,
    //     'firstname': 'Yoshida',
    //     'lastname': 'Nguyen Van'
    //   },
    //   {
    //     'id': 4,
    //     'firstname': 'Nakama',
    //     'lastname': 'Pham Duc'
    //   },
    // ];
    // console.log('onit: ', this.events);

  }

  ngOnChanges() {
    // console.log('change: ', this.events);
    // console.log('change event call');

  }

  ngAfterViewInit() {
    // console.log('after: ', this.events);
    // console.log('after event call');
  }

  ngOnDestroy() {
    // console.log('destroy: ', this.events);

    this.setSelectedSCsPeople();
    this.setSelectedSCsStatus();
    this.setSelectedOutageStatus();
    this.setSelectedOutageCategories();
    this.setSelectedPlant();
    this.setSelectedCreatorEditor();
    this.setSelectedTimeStart();
    this.setSelectedTimeEnd();
    this.setEvents();
  }

  handleDayClick(event) {
    // // let offset = new Date().getTimezoneOffset();
    // //  console.log(offset);
    // //  console.log(event.date.subtract(offset, 'minutes'));
    // //  this.event.start = event.date.add(offset, 'minutes').toDate();


    // this.event = new MyEvent();
    // this.event.start = event.date.toDate();
    // this.dialogNewVisible = true;
  }

  handleEventClick(e) {
    // this.calendarSrv.setSelectedEvent(e);
    // this.event = new MyEvent();
    // this.event.title = e.calEvent.title;

    // const start = e.calEvent.start;
    // const end = e.calEvent.end;
    // console.log(e.calEvent);
    // if (e.view.name === 'month') {
    //   // start.stripTime();
    // }

    // if (end) {
    //   // end.stripTime();
    //   this.event.end = new Date(end);
    // }

    // this.event.id = e.calEvent.id;
    //  this.event.start = new Date(start);
    // this.event.allDay = e.calEvent.allDay;
    // this.dialogVisible = true;

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


  //#region general SCs and OTs
  // init SCs and Outages
  async initListSCsOutage() {
    let listPages: any;
    listPages = [];
    if ((this.events = this.scotSrv.getListServiceCallOutage()) == null) {
      let totalService;
      let totalOutage;
      try {
        // get total Outages
        totalOutage  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });

        // get listPage of OTs
        this.getListPageOutages(listPages, totalOutage);

        // get total Services
        totalService  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsservices/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });

        // get listPage of Scs
        this.getListPageServiceCalls(listPages, totalService);

        // fetch all OTs and SCs
        this.getOutageServiceCallFromAPI(listPages);

      } catch (error) {
        throw error;
      }
    } else {
      this.listEvents = this.scotSrv.getListEvents()
      console.log('events: ', this.events);
      console.log('list events: ', this.listEvents);
    }

    //get creator and editor from SCs and OTs
    if ((this.listCreatorEditor = this.creatorEditorSrv.getListCreatorEditor()) == null) {
      this.getCreatorEditor(listPages);
    }
  }

  private setEvents() {
    let key;
    key = 'localServiceCallOutage';
    sessionStorage.setItem(key, JSON.stringify(this.events));
  }

  private getListPageOutages(listPages, totalOutage) {
    if ( totalOutage >= 20) {
      for (let page = 1; page <= Math.floor(totalOutage / 20); page++) {
        let tmp;
        tmp = new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsoutages/fetch?page=${page}`, httpOptions).subscribe(data => {
            resolve(data);
          });
        });
        listPages.push(tmp);
      }
    } else {
      let tmp;
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
  }

  private getListPageServiceCalls(listPages, totalService) {
    if ( totalService >= 20) {
      for (let page = 1; page <= Math.floor(totalService / 20); page++) {
        let tmp;
        tmp = new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsservices/fetch?page=${page}`, httpOptions).subscribe(data => {
            resolve(data);
          });
        });
        listPages.push(tmp);
      }
    } else {
      let tmp;
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsservices/fetch`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
  }

  private getOutageServiceCallFromAPI(listPages) {
    let itemServiceCallOutage;
    let keySCOT = 'localServiceCallOutage';
    let keyListEvents = 'localListEvents';
    Promise.all(listPages).then(rs => {
      let scSet;
      scSet = new Set();
      this.events = [];
      this.listEvents =[];
      rs.forEach(items => {
        items['data'].forEach(item => {
          if (item['begin'] !== undefined) {
            itemServiceCallOutage = new Outage();
            itemServiceCallOutage.getInfo(item);
          } else {
            itemServiceCallOutage = new ServiceCall();
            itemServiceCallOutage.getInfo(item);
          }
          this.events.push(itemServiceCallOutage);
          this.listEvents.push(itemServiceCallOutage);
        });
      });
      sessionStorage.setItem(keySCOT, JSON.stringify(this.events));
      sessionStorage.setItem(keyListEvents, JSON.stringify(this.listEvents));
    });
  }

  private getCreatorEditor(listPages) {
    let itemCreatorEditor;
    let key;
    key = 'localCreatorEditor';
    Promise.all(listPages).then(rs => {
      let ceSet;
      ceSet = new Set();
      rs.forEach(items => {
        items['data'].forEach(item => {
          if (item['creator_id'] !== undefined && item['creator_id'] !== null) {
            ceSet.add(item['creator_id']);
          }
          if (item['creator_person_id'] !== undefined && item['creator_person_id'] !== null) {
            ceSet.add(item['creator_person_id']);
          }
          if (item['modifier_id'] !== null && item['modifier_id'] !== undefined) {
            ceSet.add(item['modifier_id']);
          }
          if (item['modifier_person_id'] !== null && item['modifier_person_id'] !== undefined) {
            ceSet.add(item['modifier_person_id']);
          }
        });
      });
      let listId;
      listId = [];
      listId = Array.from(ceSet);
      listId = listId.join(',');
      this.http.get(`${Config.api_endpoint}people/fetch?ids=${listId}`, httpOptions).subscribe(data => {
        this.listCreatorEditor = [];
        this.listCreatorEditor = data['data'];
        sessionStorage.setItem(key, JSON.stringify(this.listCreatorEditor));
      });
    });
  }
  //#endregion

  // init outage Category
  async initListOutageCategories() {
    let key;
    key = 'localOutageCategory';
    let arrayPeople;
    arrayPeople = new Array();
    if ((this.outageCategories = this.otCategorySrv.getListOutageCategory()) == null) {
      let listPages: any;
      listPages = [];
      let totalOutage;
      try {
        // get total Outages
        totalOutage  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        if ( totalOutage >= 20) {
          for (let page = 1; page <= Math.floor(totalOutage / 20); page++) {
            let tmp;
            tmp = new Promise((resolve, reject) => {
              this.http.get(`${Config.api_endpoint}tsoutages/fetch?page=${page}`, httpOptions).subscribe(data => {
                resolve(data);
              });
            });
            listPages.push(tmp);
          }
        } else {
          let tmp;
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
          let otSet;
          let addItem = true;
          otSet = new Set();
          rs.forEach(outages => {
            outages['data'].forEach(ot => {
              if (ot['tsoutagecategory'].length !== 0) {
                otSet.forEach(category => {
                  if (category['id'] === ot['tsoutagecategory']['id']) {
                    addItem = false;
                  }
                });
                if (addItem) {
                  otSet.add(ot['tsoutagecategory']);
                }
              }
            });
          });
          this.outageCategories = [];
          otSet.forEach(category => {
            this.outageCategories.push(category);
          });
          sessionStorage.setItem(key, JSON.stringify(this.outageCategories));
        });
      } catch (error) {
        throw error;
      }
    }
  }

  // init plant list
  initListPlants() {
    let key;
    key = 'localPlant';
    if ((this.listPlants = this.plantsSrv.getListPlants()) == null) {
      this.http.get(`${Config.api_endpoint}plants/fetch`, httpOptions).subscribe(data => {
        this.listPlants = [];
        this.listPlants = data['data'];

        sessionStorage.setItem(key, JSON.stringify(this.listPlants));
      });
    }
  }

  // init participating people
  async initListParticipatingPeople() {
    let key;
    key = 'localParticipatingPeople';
    let arrayPeople;
    arrayPeople = new Array();
    if ((this.listParticipatingPeople = this.participatingPeopleSrv.getListParticipatingPeople()) == null) {
      let listPages: any;
      listPages = [];
      let totalPerson;
      try {
        totalPerson  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsservices/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        for (let page = 1; page <= Math.floor(totalPerson / 20); page++) {
          let tmp;
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}tsservices/fetch?page=${page}`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }
        Promise.all(listPages).then(rs => {
          let peopleSet;
          peopleSet = new Set();
          rs.forEach(services => {
            services['data'].forEach(sv => {
              if (sv['people'].length !== 0) {
                sv['people'].forEach(person => {
                  peopleSet.add(person['id']);
                });
              }
            });
          });
          let listId;
          listId = [];
          listId = Array.from(peopleSet);
          listId = listId.join(',');
          this.http.get(`${Config.api_endpoint}people/fetch?ids=${listId}`, httpOptions).subscribe(data => {
            this.listParticipatingPeople = [];
            this.listParticipatingPeople = data['data'];
            sessionStorage.setItem(key, JSON.stringify(this.listParticipatingPeople));
          });
        });
      } catch (error) {
        throw error;
      }
    }
  }

  // get SCs people
  getSelectedSCsPeople() {
    let myItem: any;
    let key;
    key = 'selectedSCsPeople';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedSCsPeople = myItem;
    }
  }
  // set SCs people
  setSelectedSCsPeople() {
    let key;
    key = 'selectedSCsPeople';
    sessionStorage.setItem(key, JSON.stringify(this.selectedSCsPeople));
  }

  // get SCs status
  getSelectedSCsStatus() {
    let myItem: any;
    let key;
    key = 'selectedSCsStatus';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedSCsStatus = myItem;
    }
  }
  // set SCs status
  setSelectedSCsStatus() {
    let key;
    key = 'selectedSCsStatus';
    sessionStorage.setItem(key, JSON.stringify(this.selectedSCsStatus));
  }

  // get SCs status
  getSelectedOutageCategories() {
    let myItem: any;
    let key;
    key = 'selectedOutageCategories';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedOutageCategories = myItem;
    }
  }
  // set SCs status
  setSelectedOutageCategories() {
    let key;
    key = 'selectedOutageCategories';
    sessionStorage.setItem(key, JSON.stringify(this.selectedOutageCategories));
  }

  // get outage status
  getSelectedOutageStatus() {
    let myItem: any;
    let key;
    key = 'selectedOutageStatus';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      myItem = JSON.parse(myItem);
      this.selectedOutageStatus = myItem;
    }
  }
  // set outage status
  setSelectedOutageStatus() {
    let key;
    key = 'selectedOutageStatus';
    sessionStorage.setItem(key, JSON.stringify(this.selectedOutageStatus));
  }

  // get plants
  getSelectedPlant() {
    let myItem: any;
    let key;
    key = 'selectedPlant';

    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedPlant = myItem;
    }
  }
  // set plants
  setSelectedPlant() {
    let key;
    key = 'selectedPlant';
    sessionStorage.setItem(key, JSON.stringify(this.selectedPlant));
  }

  // get creator and editor
  getSelectedCreatorEditor() {
    let myItem: any;
    let key;
    key = 'selectedCreatorEditor';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined') {
      myItem = JSON.parse(myItem);
      this.selectedCreatorEditor = myItem;
    }
  }
  // set creator and editor
  setSelectedCreatorEditor() {
    let key;
    key = 'selectedCreatorEditor';
    sessionStorage.setItem(key, JSON.stringify(this.selectedCreatorEditor));
  }

  // get time start
  getSelectedTimeStart() {
    let myItem: any;
    let key;
    key = 'selectedTimeStart';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      myItem = JSON.parse(myItem);
      this.timeStart = new Date(myItem);
    }
  }
  // set time start
  setSelectedTimeStart() {
    let key;
    key = 'selectedTimeStart';
    sessionStorage.setItem(key, JSON.stringify(this.timeStart));
  }

  // get time end
  getSelectedTimeEnd() {
    let myItem: any;
    let key;
    key = 'selectedTimeEnd';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      myItem = JSON.parse(myItem);
      this.timeEnd = new Date(myItem);
    }
  }
  // set time end
  setSelectedTimeEnd() {
    let key;
    key = 'selectedTimeEnd';
    sessionStorage.setItem(key, JSON.stringify(this.timeEnd));
  }

  filterPlants(eventSelected) {
    var listID = [];
    if (eventSelected.value === undefined) {
      eventSelected.forEach(plantID => {
        listID.push(parseInt(plantID));
      });
      this.events = this.events.filter(function(e){
        return this.indexOf(e['plant_id']) >= 0;
      }, listID);
    }
    if (listID.length === 0) {
      this.events = this.listEvents;
    }
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
