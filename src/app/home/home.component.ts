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
import { all } from 'q';

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

  dialogNewVisible = false;
  dialogServiceCallVisible = false;
  isServiceCall = false;
  dialogOutageVisible = false;
  isOutage = false;
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
  options: any;
  // options = {
  //   'firstDay' : 1,
  //   'showNonCurrentDates': false,
  // };
  // constructor(private nodeService: NodeService, private messageService: MessageService) { }
  constructor(private http: HttpClient,
              private calendarSrv: CalendarService,
              private plantsSrv: PlantsService,
              private participatingPeopleSrv: ParticipatingPeopleService,
              private scotSrv: ServicecallOutageService,
              private otCategorySrv: OutageCategoryService,
              private creatorEditorSrv: CreatorEditorService,
              private router: Router) {

    this.options = {
      defaultDate: this.selectedDate,
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      height: 550,
      businessHours: this.businessHours,
      editable: true,
      weekNumbers: true,
      eventLimit: 4,
      defaultView: this.selectedView,
      eventClick: this.handleEventClick(Event),
      timezone: "local",
      id: "calendar"
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
    this.initListParticipatingPeople();
    this.initListSCsOutage();
    this.initListPlants();
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

  }

  ngOnChanges() {

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {

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
    // if (e.calEvent.event.people !== undefined) {
    //   this.event = new ServiceCall();
    //   this.event.getInfo(e.calEvent.event);
      
    //   console.log('clicked event: ', this.event);
    //   this.isServiceCall = true;
    //   this.dialogServiceCallVisible = true;
    // } else {
    //   this.event = new Outage();
    //   this.event.getInfo(e.calEvent.event);
    //   this.isOutage = true;
    //   this.dialogOutageVisible = true;
    // }
    // this.calendarSrv.setSelectedEvent(e);

    // const start = e.calEvent.start;
    // const end = e.calEvent.end;
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

  }

  saveEvent() {
    // let offset;
    // offset = new Date().getTimezoneOffset();
    // //  update or new
    // if (this.event.id) {
    //   let index: number;
    //   index = this.findEventIndexById(this.event.id);
    //   if (index >= 0) {
    //     this.events[index] = this.event;
    //   }
    // } else {
    //   this.event.id = this.idGen++;
    //   console.log(this.event.start);
    //   console.log(this.event.end);
    //   this.events.push(this.event);
    //   this.event = null;
    // }

    // this.dialogNewVisible = false;
  }

  editEvent(event) {
    // this.router.navigate(['/detail', event.id]);
  }

  deleteEvent() {
    // let index: number;
    // index = this.findEventIndexById(this.event.id);
    // if (index >= 0) {
    //   this.events.splice(index, 1);
    // }
    // this.dialogServiceCallVisible = false;
  }

  findEventIndexById(id: number) {
    // let index = -1;
    // for (let i = 0; i < this.events.length; i++) {
    //   if (id === this.events[i].id) {
    //     index = i;
    //     break;
    //   }
    // }

    // return index;
  }

  fetchEvents(eventData) {
    // console.log(eventData);
    // Config.defaultView = eventData.view.name;
  }

  onSelectEnd(eventData) {
    // let offset;
    // offset = new Date().getTimezoneOffset();
    // console.log(eventData);
  }

  gotoDate(event, selectedDate) {
    let date;
    date = new Date(event);
    console.log('click day is', date);
    console.log('click day', selectedDate);
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
  // initListOutageCategories() {
  //   let key;
  //   key = 'localOutageCategory';
  //   if ((this.outageCategories = this.otCategorySrv.getListOutageCategory()) == null) {
  //     this.http.get(`${Config.api_endpoint}tsoutagecategories/fetch`, httpOptions).subscribe(data => {
  //       // console.log()
  //       // this.outageCategories = [];
  //       // this.outageCategories = data['data'];
  //       // sessionStorage.setItem(key, JSON.stringify(this.outageCategories));
  //     });
  //   }
  // }
  async initListOutageCategories() {
    let key;
    key = 'localOutageCategory';
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

  // fillter by plants
  filterPlants() {
    var listID = [];
    if (this.selectedPlant !== null) {
      this.selectedPlant.forEach(plantID => {
        listID.push(parseInt(plantID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          return this.indexOf(e.plantID) >= 0;
        }, listID);
      }
    }
  }
  
  // filter by creator and editor
  filterCreatorEditor() {
    var listID = [];
    if (this.selectedCreatorEditor !== null) {
      this.selectedCreatorEditor.forEach(personID => {
        listID.push(parseInt(personID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          if ((e.event.creator_id !== undefined
            && e.event.creator_id !== null)
            || (e.event.modifier_id !== undefined
            && e.event.modifier_id !== null)) {
            return (this.indexOf(e.event.creator_id) >= 0) || (this.indexOf(e.event.modifier_id) >= 0);
          }
          if (e.event.creator_person_id !== undefined
            && e.event.creator_person_id !== null
            && e.event.modifier_person_id !== undefined
            && e.event.modifier_person_id !== null) {
            return (this.indexOf(e.event.creator_person_id) >= 0) || (this.indexOf(e.event.modifier_person_id) >= 0);
          }
        }, listID);
      }
    }
  }

  // filter by start time and end time
  filterTimeStartEnd() {
    if ((this.timeStart !== undefined && this.timeStart !== null)
      && (this.timeEnd === undefined || this.timeEnd === null)) {
        console.log('time start', this.timeStart);
        this.events = this.events.filter(e => {
          let timeStart = new Date(e.start);
          return this.timeStart <= timeStart;
        });
      }
    if ((this.timeStart === undefined || this.timeStart === null)
      && (this.timeEnd !== undefined && this.timeEnd !== null)) {
        console.log('time end', this.timeEnd);
      this.events = this.events.filter(e => {
        let timeEnd = new Date(e.end);
        return this.timeEnd >= timeEnd;
      });
    } 
    if ((this.timeStart !== undefined && this.timeStart !== null)
    && (this.timeEnd !== undefined && this.timeEnd !== null)) {
      console.log('time start-end', this.timeStart, this.timeEnd);
      this.events = this.events.filter(e => {
        let timeStart = new Date(e.start);
        let timeEnd = new Date(e.end);
        return (this.timeStart <= timeStart) && (this.timeEnd >= timeEnd);
      });
    }
  }

  // filter by outage category
  filterOutagesCategory() {
    var listID = [];
    if (this.selectedOutageCategories !== null) {
      this.selectedOutageCategories.forEach(categoryID => {
        listID.push(parseInt(categoryID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          if (e.event.tsoutagecategory !== undefined
            && e.event.tsoutagecategory !== null) {
            return this.indexOf(e.event.tsoutagecategory.id) >= 0;
          }
          return true;
        }, listID);
      }
    }
  }

  // filter by participating people
  filterParticipatingPeople() {
    var listID = [];
    if (this.selectedSCsPeople !== null) {
      this.selectedSCsPeople.forEach(personID => {
        listID.push(parseInt(personID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          if (e.event.people !== undefined
            && e.event.people !== null) {
            if (e.event.people.length > 0) {
              return this.indexOf(e.event.people["0"].id) >= 0;
            }
          }
          return true;
        }, listID);
      }
    }
  }

  // filter by ServiceCall status
  filterServiceCallStatus() {
    let today = new Date();
    if (this.selectedSCsStatus !== null) {
      switch (this.selectedSCsStatus) {
        case '1':
          break;
        case '2':
          // planted
          this.events = this.events.filter(e => {
            if (e.event.people !== undefined) {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          break;
        case '3':
          // start
          this.events = this.events.filter(e => {
            if (e.event.people !== undefined) {
              let timeStart = new Date(e.start);
              let timeEnd = new Date(e.end);
              return (timeStart <= today) && (timeEnd >= today);
            }
            return true;
          });
          break;
        default:
          // end
          this.events = this.events.filter(e => {
            if (e.event.people !== undefined) {
              let timeEnd = new Date(e.end);
              return timeEnd < today;
            }
            return true;
          });
          break;
      }
    }
  }

  // filter by OT status
  filterOutageStatus() {
    let today = new Date();
    if (this.selectedOutageStatus !== undefined) {
      switch (this.selectedOutageStatus) {
        case '1':
          break;
        case '2':
          // planted
          this.events = this.events.filter(e => {
            if (e.event.tsoutagecategory !== undefined) {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          break;
        case '3':
          // start
          this.events = this.events.filter(e => {
            if (e.event.tsoutagecategory !== undefined) {
              let timeStart = new Date(e.start);
              let timeEnd = new Date(e.end);
              return (timeStart <= today) && (timeEnd >= today);
            }
            return true;
          });
          break;
        default:
          // end
          this.events = this.events.filter(e => {
            if (e.event.tsoutagecategory !== undefined) {
              let timeEnd = new Date(e.end);
              return timeEnd < today;
            }
            return true;
          });
          break;
      }
    }
  }

  // filter by All conditions
  filterAll(eventSelected) {
    this.events = this.listEvents;
    if (eventSelected.value === undefined) {
      this.filterParticipatingPeople();
      this.filterServiceCallStatus();
      this.filterOutagesCategory();
      this.filterOutageStatus();
      this.filterPlants();
      this.filterCreatorEditor();
      this.filterTimeStartEnd();
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
