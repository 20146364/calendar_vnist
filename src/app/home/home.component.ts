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
import { TicketsService} from '../services/tickets.service';
import { ParticipatingPeopleService} from '../services/participating-people.service';
import { ServicecallOutageService} from '../services/servicecall-outage.service';
import {OutageCategoryService} from '../services/outage-category.service';
import {CreatorEditorService} from '../services/creator-editor.service';

import { IEvent } from '../models/event';
import { ServiceCall } from '../models/service-call';
import { Outage } from '../models/outage';

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

  // Tickets list
  listTickets: any[];

  // time start
  timeStart: Date;

  // time end
  timeEnd: Date;

  title = 'Calendar View';

  // Event
  events: any[];
  eventsPrev: any[];
  eventsNext: any[];
  listEvents: any[];
  listEventsPrev: any[];
  listEventsNext: any[];

  // current Time
  currentTimeShow: Date;

  header: any;

  event: IEvent;
  eventSC: ServiceCall;
  eventOT: Outage;
  eventOutage;

  dialogNewVisible = false;
  dialogServiceCallVisible: boolean = false;
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
  // constructor(private nodeService: NodeService, private messageService: MessageService) { }

  displayServiceCallDetail = false;
  showServiceCallDetailDialog() {
    this.displayServiceCallDetail = true;
  }
  displayOutageDetail = false;
  showOutageDetailDialog() {
    this.displayOutageDetail = true;
  }


  constructor(private http: HttpClient,
              private calendarSrv: CalendarService,
              private plantsSrv: PlantsService,
              private ticketsSrv: TicketsService,
              private participatingPeopleSrv: ParticipatingPeopleService,
              private scotSrv: ServicecallOutageService,
              private otCategorySrv: OutageCategoryService,
              private creatorEditorSrv: CreatorEditorService,
              private router: Router) {
    this.currentTimeShow = new Date();
    let key = 'currentTimeView';
    sessionStorage.setItem(key, JSON.stringify(this.currentTimeShow));
    
    // if (this.calendarSrv.getSelectedEvent() !== 0) {
    //   this.selectedEvent = this.calendarSrv.getSelectedEvent();
    //   this.selectedView = this.selectedEvent.view.name;
    //   this.selectedDate = this.selectedEvent.calEvent.start.format();
    // }

  }

  ngOnInit() {
    // fullcalendar's options
    this.options = {
      header: {
        left: '',
        center: 'title',
        right: ''
      },
      firstDay: 1,
      showNonCurrentDates: false,
      height: 550,
      defaultDate: this.selectedDate,
      businessHours: this.businessHours,
      defaultView: this.selectedView,
      weekNumbers: true,
      editable: true,
      eventClick: this.handleEventClick,
      dateClick: this.handleDayClick,
      timezone: "local",
      eventLimit: true,
      id: "calendar",
    };
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
    this.initListEvents(this.currentTimeShow, this.currentTimeShow);
    this.getListEventsPrev(this.currentTimeShow);
    this.getListEventsNext(this.currentTimeShow);
    this.initListParticipatingPeople();
    this.initListPlants();
    this.initListTickets();
    this.initListOutageCategories();

    this.updateChangesFeed();
    
    this.getSelectedSCsPeople();
    this.getSelectedSCsStatus();
    this.getSelectedOutageStatus();
    this.getSelectedOutageCategories();
    this.getSelectedCreatorEditor();
    this.getSelectedPlant();
    this.getSelectedTimeStart();
    this.getSelectedTimeEnd();
    this.setCurrentView('month');

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
    this.setListServiceCallOutage();
  }

  handlePrevClick = (e, fc) => {
    fc.calendar.prev();
    let currentTimeView = this.getCurrentTimeView();
    let currentView = this.getCurrentView();
    let beforeTime;
    let afterTime;
    let range = 'visible';
    switch (currentView) {
      // month
      case 'month':
        currentTimeView = this.getAfterTimeMonth(currentTimeView);
        this.events = this.scotSrv.getListServiceCallOutagePrev();
        console.log('prev month', this.events)
        if ((this.events === null) || (this.events == [])) {
          beforeTime = this.getBeforeTimeMonth(currentTimeView);
          afterTime = this.getAfterTimeMonth(currentTimeView);
          this.getListSCsOutage(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsPrev()
        }
        this.setListServiceCallOutage();
        this.setListEvents();
        this.getListEventsNext(currentTimeView);
        this.getListEventsPrev(currentTimeView);
        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
        // can lau dc ngay dang hien thi
        currentTimeView = this.getAfterTimeDay(currentTimeView);
        beforeTime = this.getBeforeTimeMonth(currentTimeView);
        afterTime = this.getAfterTimeDay(currentTimeView);
        this.getListSCsOutage(afterTime, beforeTime, range);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleNextClick = (e, fc) => {
    fc.calendar.next();
    let currentTimeView = this.getCurrentTimeView();
    let currentView = this.getCurrentView();
    let beforeTime;
    let afterTime;
    let range = 'visible';
    switch (currentView) {
      // month
      case 'month':
        currentTimeView = this.getBeforeTimeMonth(currentTimeView);
        this.events = this.scotSrv.getListServiceCallOutageNext();
        console.log('next month', this.events)
        if (this.events === null || (this.events == [])) {
          beforeTime = this.getBeforeTimeMonth(currentTimeView);
          afterTime = this.getAfterTimeMonth(currentTimeView);
          this.getListSCsOutage(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsNext()
        }
        this.setListServiceCallOutage();
        this.setListEvents();
        this.getListEventsNext(currentTimeView);
        this.getListEventsPrev(currentTimeView);
        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
      // can lau dc ngay dang hien thi
        // afterTime = currentTimeView;
        currentTimeView = this.getBeforeTimeDay(currentTimeView);
        beforeTime = this.getBeforeTimeDay(currentTimeView);
        afterTime = this.getAfterTimeMonth(currentTimeView);
        this.getListSCsOutage(afterTime, beforeTime, range);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleTodayClick = (e, fc) => {
    fc.calendar.today();
    let currentTimeView = new Date();
    let currentView = this.getCurrentView();
    let beforeTime;
    let afterTime;
    let range = 'visible';
    switch (currentView) {
      // month
      case 'month':
        // if ((this.events = this.scotSrv.getListServiceCallOutageNext()) === null) {
          beforeTime = this.getBeforeTimeMonth(currentTimeView);
          afterTime = this.getAfterTimeMonth(currentTimeView);
          this.getListSCsOutage(afterTime, beforeTime, range);
        // } else {
        //   this.listEvents = this.scotSrv.getListEventsNext()
        // }
        this.setListServiceCallOutage();
        this.setListEvents();
        this.getListEventsNext(currentTimeView);
        this.getListEventsPrev(currentTimeView);

        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
        beforeTime = this.getBeforeTimeDay(currentTimeView);
        afterTime = this.getAfterTimeDay(currentTimeView);
        this.getListSCsOutage(afterTime, beforeTime, range);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleMonthClick = (e, fc) => {
    fc.calendar.changeView('month');
    this.setCurrentView('month');
    // set Ngay dau tien trong thang
  }
  
  handleAgendaWeekClick = (e, fc) => {
    fc.calendar.changeView('agendaWeek');
    this.setCurrentView('agendaWeek');
    // set Tuan dau tien trong thang
  }
  
  handleAgendaDayClick = (e, fc) => {
    fc.calendar.changeView('agendaDay');
    this.setCurrentView('agendaDay');
    // set Ngay dau tien trong thang
  }

  handleDayClick = (e) => {
    // console.log(e);
    // // let offset = new Date().getTimezoneOffset();
    // //  console.log(offset);
    // //  console.log(event.date.subtract(offset, 'minutes'));
    // //  this.event.start = event.date.add(offset, 'minutes').toDate();


    // this.event = new MyEvent();
    // this.event.start = event.date.toDate();
    // this.dialogNewVisible = true;
  }

  handleEventClick = (e) => {
    // console.log(e.event);
    if (e.event.extendedProps.typeOfEvent === "ServiceCall") {
      this.eventSC = new ServiceCall();
      this.eventSC.getInfo(e.event);
      this.showServiceCallDetailDialog();
    } else {
      this.eventOT = new Outage();
      this.eventOT.getInfo(e.event);
      this.showOutageDetailDialog();
    }
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
    selectedDate.calendar.gotoDate(date);
  }

  //#region general SCs and OTs
  // init SCs and Outages
  // async initListSCsOutage() {
  //   let listPages: any;
  //   listPages = [];
  //   this.events = this.scotSrv.getListServiceCallOutage();
  //   if (this.events === null) {
  //     let totalService;
  //     let totalOutage;
  //     try {
  //       // get total Outages
  //       totalOutage  = await new Promise((resolve, reject) => {
  //         this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
  //           resolve(data['total']);
  //         });
  //       });

  //       // get listPage of OTs
  //       this.getListPageOutages(listPages, totalOutage);

  //       // get total Services
  //       totalService  = await new Promise((resolve, reject) => {
  //         this.http.get(`${Config.api_endpoint}tsservices/fetch`, httpOptions).subscribe(data => {
  //           resolve(data['total']);
  //         });
  //       });

  //       // get listPage of Scs
  //       this.getListPageServiceCalls(listPages, totalService);

  //       // fetch all OTs and SCs
  //       this.getOutageServiceCallFromAPI(listPages);

  //     } catch (error) {
  //       throw error;
  //     }
  //   } else {
  //     this.listEvents = this.scotSrv.getListEvents()
  //   }

  //   //get creator and editor from SCs and OTs
  //   if ((this.listCreatorEditor = this.creatorEditorSrv.getListCreatorEditor()) == null) {
  //     this.getCreatorEditor(listPages);
  //   }
  // }


  // init SCs and outages
  async getListSCsOutage(startTime, endTime, range) {
    let start = startTime.toISOString();
    let end  = endTime.toISOString();
    let listPages: any;
    listPages = [];
    this.events = this.scotSrv.getListServiceCallOutage();
      let totalService;
      let totalOutage;
      try {
        // get Outages
        totalOutage  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsoutages/fetch?time_after=${start}&time_before=${end}`, httpOptions).subscribe(data => {
            // console.log('data outages:', data);
            resolve(data['total']);
          });
        });
        this.getListPageOutages(listPages, totalOutage, start, end);

        // get Services
        totalService  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsservices/fetch?time_after=${start}&time_before=${end}`, httpOptions).subscribe(data => {
            // console.log('data services:', data);
            // console.log('start:', start);
            // console.log('end:', end);
            resolve(data['total']);
          });
        });
        this.getListPageServiceCalls(listPages, totalService, start, end);

        // fetch all OTs and SCs visiable range
        this.getOutageServiceCallFromAPI(listPages, range);
      } catch (error) {
        throw error;
      }
    //get creator and editor from SCs and OTs
    if ((this.listCreatorEditor = this.creatorEditorSrv.getListCreatorEditor()) == null) {
      this.getCreatorEditor(listPages);
    }
  }

  // init List Events visiable range
  initListEvents(startTime, endTime) {
    let range = 'visible';
    if ((this.events = this.scotSrv.getListServiceCallOutage()) === null) {
      this.getListSCsOutage(startTime, endTime, range);
    } else {
      this.listEvents = this.scotSrv.getListEvents()
    }
  }

  // get List Events prev month
  getListEventsPrev(currentTimeView) {
    let beforeTime;
    let afterTime;
    let range = 'prev';
    // if ((this.eventsPrev = this.scotSrv.getListServiceCallOutagePrev()) === null) {
      currentTimeView = this.getAfterTimeMonth(currentTimeView);
      beforeTime = this.getBeforeTimeMonth(currentTimeView);
      afterTime = this.getAfterTimeMonth(currentTimeView);
      this.getListSCsOutage(afterTime, beforeTime, range);
    // } else {
    //   this.listEventsPrev = this.scotSrv.getListEventsPrev()
    // }
  }

  // get List Events next month
  getListEventsNext(currentTimeView) {
    let beforeTime;
    let afterTime;
    let range = 'next';
    // if ((this.eventsNext = this.scotSrv.getListServiceCallOutageNext()) == null) {
      currentTimeView = this.getBeforeTimeMonth(currentTimeView);
      beforeTime = this.getBeforeTimeMonth(currentTimeView);
      afterTime = this.getAfterTimeMonth(currentTimeView);
      this.getListSCsOutage(afterTime, beforeTime, range);
    // } else {
    //   this.listEventsNext = this.scotSrv.getListEventsNext()
    // }
  }

  private setListServiceCallOutage() {
    let key = 'localSCOT';
    sessionStorage.setItem(key, JSON.stringify(this.events));
  }

  private setListEvents() {
    let key = 'localListEvents';
    sessionStorage.setItem(key, JSON.stringify(this.listEvents));
  }

  private getListPageOutages(listPages, totalOutage, start, end) {
    let pages = totalOutage /20;
    let modulusValue = totalOutage % 20;
    let tmp;
    for (let page = 1; page <= Math.floor(pages); page++) {
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsoutages/fetch?time_after=${start}&time_before=${end}&page=${page}`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
    pages++;
    tmp = new Promise((resolve, reject) => {
      this.http.get(`${Config.api_endpoint}tsoutages/fetch?time_after=${start}&time_before=${end}&limit=${modulusValue}&page=${pages}`, httpOptions).subscribe(data => {
        resolve(data);
      });
    });
    listPages.push(tmp);
  }

  private getListPageServiceCalls(listPages, totalService, startTime, endTime) {
    // get total Services
    let pages = totalService /20;
    let modulusValue = totalService % 20;
    let tmp;
    for (let page = 1; page <= Math.floor(pages); page++) {
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsservices/fetch?time_after=${startTime}&time_before=${endTime}&page=${page}`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
    pages++;
    tmp = new Promise((resolve, reject) => {
      this.http.get(`${Config.api_endpoint}tsservices/fetch?time_after=${startTime}&time_before=${endTime}&limit=${modulusValue}&page=${pages}`, httpOptions).subscribe(data => {
        resolve(data);
      });
    });
    listPages.push(tmp);
  }

  getOutageServiceCallFromAPI(listPages, range) {
    let itemServiceCallOutage: IEvent;
    let keySCOT;
    let keyListEvents;
    switch (range) {
      case 'visible':
        keySCOT = 'localSCOT';
        keyListEvents = 'localListEvents';
        Promise.all(listPages).then(rs => {
          this.events = [];
          this.listEvents =[];
          rs.forEach(items => {
            items['data'].forEach(item => {
              if (item['begin'] !== undefined) {
                itemServiceCallOutage = new Outage();
                itemServiceCallOutage.initInfo(item);
              } else {
                itemServiceCallOutage = new ServiceCall();
                itemServiceCallOutage.initInfo(item);
              }
              this.events.push(itemServiceCallOutage);
              this.listEvents.push(itemServiceCallOutage);
            });
          });
          sessionStorage.setItem(keySCOT, JSON.stringify(this.events));
          sessionStorage.setItem(keyListEvents, JSON.stringify(this.listEvents));
        });
        break;
      case 'prev':
        keySCOT = 'localSCOTPrev';
        keyListEvents = 'localListEventsPrev';
        Promise.all(listPages).then(rs => {
          this.eventsPrev = [];
          this.listEventsPrev =[];
          rs.forEach(items => {
            items['data'].forEach(item => {
              if (item['begin'] !== undefined) {
                itemServiceCallOutage = new Outage();
                itemServiceCallOutage.initInfo(item);
              } else {
                itemServiceCallOutage = new ServiceCall();
                itemServiceCallOutage.initInfo(item);
              }
              this.eventsPrev.push(itemServiceCallOutage);
              this.listEventsPrev.push(itemServiceCallOutage);
            });
          });
          sessionStorage.setItem(keySCOT, JSON.stringify(this.eventsPrev));
          sessionStorage.setItem(keyListEvents, JSON.stringify(this.listEventsPrev));
        });
        break;
      default:
        keySCOT = 'localSCOTNext';
        keyListEvents = 'localListEventsNext';
        Promise.all(listPages).then(rs => {
          this.eventsNext = [];
          this.listEventsNext =[];
          rs.forEach(items => {
            items['data'].forEach(item => {
              if (item['begin'] !== undefined) {
                itemServiceCallOutage = new Outage();
                itemServiceCallOutage.initInfo(item);
              } else {
                itemServiceCallOutage = new ServiceCall();
                itemServiceCallOutage.initInfo(item);
              }
              this.eventsNext.push(itemServiceCallOutage);
              this.listEventsNext.push(itemServiceCallOutage);
            });
          });
          sessionStorage.setItem(keySCOT, JSON.stringify(this.eventsNext));
          sessionStorage.setItem(keyListEvents, JSON.stringify(this.listEventsNext));
        });
        break;
    }
    
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

  // get month before
  getBeforeTimeMonth(currentTime: Date) {
    let end = new Date(currentTime);
    let currentMonth = end.getMonth()
    let currentYear = end.getFullYear();
    if (currentMonth != 11) {
      currentMonth++; 
    } else {
      currentMonth = 0;
      currentYear++;
    }
    end = new Date(currentYear, currentMonth, 2);
    return end;
  }

  // get month after
  getAfterTimeMonth(currentTime: Date) {
    let start = new Date(currentTime);
    let currentMonth = start.getMonth();
    let currentYear = start.getFullYear();
    if (currentMonth != 0) {
      currentMonth--;
    } else {
      currentMonth = 11;
      currentYear--;
    }
    //start = new Date(currentYear, currentMonth + 1, 0);
    start.setFullYear(currentYear);
    start.setMonth(currentMonth+1);
    start.setDate(0);
    return start;
  }

  // get month before
  getBeforeTimeDay(currentTime: Date) {
    let end = new Date(currentTime);
    let currentDate = end.getDate();
    end.setDate(++currentDate);
    return end;
  }

  // get month after
  getAfterTimeDay(currentTime: Date) {
    let start = new Date(currentTime);
    let currentDate = start.getDate();
    start.setDate(--currentDate);
    return start;
  }

  // init outage Category
  // initListOutageCategories() {
  //   let key;
  //   key = 'localOutageCategory';
  //   if ((this.outageCategories = this.otCategorySrv.getListOutageCategory()) == null) {
  //     this.http.get(`${Config.api_endpoint}tsoutagecategories/fetch`, httpOptions).subscribe(data => {
  //       console.log('outage category', data);
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
      let totalOutageCategory;
      try {
        // get total Outages
        totalOutageCategory  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsoutages/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        if ( totalOutageCategory >= 20) {
          for (let page = 1; page <= Math.floor(totalOutageCategory / 20); page++) {
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

  // init tickets list
  async initListTickets() {
    let key;
    key = 'localTicket';
    if ((this.listTickets = this.ticketsSrv.getListTickets()) == null) {
      let listPages: any;
      listPages = [];
      let totalTicket;
      try {
        // get total tickets
        totalTicket  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tstickets/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        if ( totalTicket >= 20) {
          for (let page = 1; page <= Math.floor(totalTicket / 20); page++) {
            let tmp;
            tmp = new Promise((resolve, reject) => {
              this.http.get(`${Config.api_endpoint}tstickets/fetch?page=${page}`, httpOptions).subscribe(data => {
                resolve(data);
              });
            });
            listPages.push(tmp);
          }
        } else {
          let tmp;
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}tstickets/fetch`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
          let addItem = true;
          this.listTickets = [];
          rs.forEach(tickets => {
            tickets['data'].forEach(tk => {
              this.listTickets.push(tk);
            });
          });
          sessionStorage.setItem(key, JSON.stringify(this.listTickets));
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

  // check changes feed
  updateChangesFeed() {
    let key = 'priorTime';
    let myItem: any;
    let priorTime;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      priorTime = JSON.parse(myItem);
    } else {
      priorTime = (new Date()).toISOString();
    }
    sessionStorage.setItem(key, JSON.stringify((new Date()).toISOString()));

    key = 'localChangesFeed';
    let changesFeed;
    // "2016-10-05T14:48:00.000Z"
    priorTime ="2018-12-01T14:48:00.000Z";
    this.http.get(`${Config.api_endpoint}changes?since=${priorTime}`, httpOptions).subscribe(listData => {
      console.log('changes feed', listData);
        changesFeed = [];
        changesFeed = listData['data'];
        changesFeed.forEach(data => {
          switch (data.changeType) {
            case "created":
              this.createNewData(data);
              break;
            case "modified":
              this.modifyOldData(data);
              break;
            default:
              this.deleteOldData(data);
              break;
          }
        });
        // sessionStorage.setItem(key, JSON.stringify(changesFeed));
      });
  }

  removeEvent(listPlants: any[], id) {
    listPlants = listPlants.map((p)=>{
      if (p.id === id) {
        return false;
       }
      return p;
    }).filter(p => p != false);
  }

  addEvent(array: any[], element) {
    array.push(element);
  }

  // create new data
  createNewData(data) {
    console.log('create new data:', data);
    switch (data.type) {
      case "Plants":
        this.plantsSrv.getPlants(data.entity_id).subscribe(plant => {
          console.log('data of plant in create:', plant[0]);
        });;
        break;
      case "Tsservices":
        
        break;
      case "Tsoutages":
        
        break;
      case "Tstickets":
        
        break;
      case "People":
        
        break;
      case "Tstickets":
        
        break;
      default:
        break;
    }
  }
  // modify new data
  modifyOldData(data) {
    switch (data.type) {
      case "Plants":
        let key;
        key = 'localPlant';
        this.plantsSrv.getPlants(data.entity_id).subscribe(plant => {
          this.listPlants = this.listPlants.map((p)=>{
            if (p.id === data.entity_id) {
              return false;
             }
            return p;
          }).filter(p => p != false);
            this.listPlants.push(plant['data'][0]);
          sessionStorage.setItem(key, JSON.stringify(this.listPlants));
        });;
        break;
      case "Tsservices":
        
        break;
      case "Tsoutages":
        
        break;
      case "Tstickets":
        
        break;
      case "People":
        
        break;
      case "Tstickets":
        
        break;
      default:
        break;
    }

  }
  // delete old data
  deleteOldData(data) {
    console.log('delete old data:', data);

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

  // get current time view
  getCurrentTimeView() {
    let myItem: any;
    let key = 'currentTimeView';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      myItem = JSON.parse(myItem);
      return new Date(myItem);
    }
  }

  // set current time view
  setCurrentTimeView(currentTimeView) {
    let key = 'currentTimeView';
    sessionStorage.setItem(key, JSON.stringify(currentTimeView));
  }

  // get current view
  getCurrentView() {
    let myItem: any;
    let key = 'currentView';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null ) {
      return myItem;
    }
  }

  // set current View
  setCurrentView(viewName) {
    let key = 'currentView';
    sessionStorage.setItem(key, viewName);
  }

  // fillter by plants
  filterPlants() {
    let listID = [];
    if (this.selectedPlant !== null) {
      this.selectedPlant.forEach(plantID => {
        listID.push(parseInt(plantID));
      });
      // console.log('listID', listID);
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          return this.indexOf(e.plantID) >= 0;
        }, listID);
      }
    }
  }
  
  // filter by creator and editor
  filterCreatorEditor() {
    let listID = [];
    if (this.selectedCreatorEditor !== null) {
      this.selectedCreatorEditor.forEach(personID => {
        listID.push(parseInt(personID));
      });
      if (listID.length !== 0) {
        this.events.forEach( e => {
        })
        this.events = this.events.filter(function(e){
          if (e.typeOfEvent === "Outage") {
            if ((e.eventOutage.creator_id !== undefined
              && e.eventOutage.creator_id !== null)
              || (e.eventOutage.modifier_id !== undefined
              && e.eventOutage.modifier_id !== null)) {
                return (this.indexOf(e.eventOutage.creator_id) >= 0)
                        || (this.indexOf(e.eventOutage.modifier_id) >= 0);
            }
          }
          if (e.typeOfEvent === "ServiceCall") {
            if ((e.eventServiceCall.creator_person_id !== undefined
              && e.eventServiceCall.creator_person_id !== null)
              || (e.eventServiceCall.modifier_person_id !== undefined
              && e.eventServiceCall.modifier_person_id !== null)) {
                return (this.indexOf(e.eventServiceCall.creator_person_id) >= 0)
                        || (this.indexOf(e.eventServiceCall.modifier_person_id) >= 0);
            }
          }
        }, listID);
      }
    }
  }

  // filter by start time and end time
  filterTimeStartEnd() {
    if ((this.timeStart !== undefined && this.timeStart !== null)
      && (this.timeEnd === undefined || this.timeEnd === null)) {
        this.events = this.events.filter(e => {
          let timeStart = new Date(e.start);
          return this.timeStart <= timeStart;
        });
      }
    if ((this.timeStart === undefined || this.timeStart === null)
      && (this.timeEnd !== undefined && this.timeEnd !== null)) {
      this.events = this.events.filter(e => {
        let timeEnd = new Date(e.end);
        return this.timeEnd >= timeEnd;
      });
    } 
    if ((this.timeStart !== undefined && this.timeStart !== null)
    && (this.timeEnd !== undefined && this.timeEnd !== null)) {
      this.events = this.events.filter(e => {
        let timeStart = new Date(e.start);
        let timeEnd = new Date(e.end);
        return (this.timeStart <= timeStart) && (this.timeEnd >= timeEnd);
      });
    }
  }

  // filter by outage category
  filterOutagesCategory() {
    let listID = [];
    if (this.selectedOutageCategories !== null) {
      this.selectedOutageCategories.forEach(categoryID => {
        listID.push(parseInt(categoryID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          if (e.typeOfEvent === "Outage") {
            return this.indexOf(e.eventOutage.tsoutagecategory.id) >= 0;
          }
          return true;
        }, listID);
      }
    }
  }

  // filter by participating people
  filterParticipatingPeople() {
    let listID = [];
    // let keepEvent = false;
    if (this.selectedSCsPeople !== null) {
      this.selectedSCsPeople.forEach(personID => {
        listID.push(parseInt(personID));
      });
      if (listID.length !== 0) {
        this.events = this.events.filter(function(e){
          if (e.typeOfEvent === "ServiceCall") {
            if (e.eventServiceCall !== undefined
              && e.eventServiceCall.people.length > 0) {
              for (let i = 0; i < e.eventServiceCall.people.length; i++) {
                if (this.indexOf(e.eventServiceCall.people[i].id) >= 0) {
                  return true;
                }
              }
            }
            return false;
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
            if (e.typeOfEvent === "ServiceCall") {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          break;
        case '3':
          // start
          this.events = this.events.filter(e => {
            if (e.typeOfEvent === "ServiceCall") {
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
            if (e.typeOfEvent === "ServiceCall") {
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
            if (e.typeOfEvent === "Outage") {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          break;
        case '3':
          // start
          this.events = this.events.filter(e => {
            if (e.typeOfEvent === "Outage") {
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
            if (e.typeOfEvent === "Outage") {
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
