import { Component, OnInit, AfterViewInit, OnChanges, OnDestroy  } from '@angular/core';
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
import {AssociationService} from '../services/association.service';

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
  htmlStr = '<strong>The Tortoise</strong> &amp; the Hare';

  event: IEvent;
  eventSC: ServiceCall;
  eventOT: Outage;
  // eventOutage;

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

  prevStatus = true;
  nextStatus = true;
  todayStatus = true;

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
              private associationSrv: AssociationService,
              private ticketsSrv: TicketsService,
              private participatingPeopleSrv: ParticipatingPeopleService,
              private scotSrv: ServicecallOutageService,
              private otCategorySrv: OutageCategoryService,
              private creatorEditorSrv: CreatorEditorService) {
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
    this.initListParticipatingPeople();
    this.initListPlants();
    this.initListTickets();
    this.initListOutageCategories();
    this.initCreatorEditor();

    // this.updateChangesFeed();
    
    this.getSelectedSCsPeople();
    this.getSelectedSCsStatus();
    this.getSelectedOutageStatus();
    this.getSelectedOutageCategories();
    this.getSelectedCreatorEditor();
    this.getSelectedPlant();
    this.getSelectedTimeStart();
    this.getSelectedTimeEnd();
    this.setCurrentView('month');
    this.getListEventsNextMonth(this.currentTimeShow);
    this.getListEventsPrevMonth(this.currentTimeShow);

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
    this.setListServiceCallOutage(this.events);
  }

  enableButton() {
    this.prevStatus = false;
    this.nextStatus = false;
    this.todayStatus = false;
  }

  disableButton() {
    this.prevStatus = true;
    this.nextStatus = true;
    this.todayStatus = true;
  }

  handlePrevClick = (e, fc) => {
    this.disableButton();
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
        // get association visiable from prev
        this.getAssociationVisiableFromPrev();
        if ((this.events === null) || (this.events == [])) {
          beforeTime = this.getBeforeTimeMonth(currentTimeView);
          afterTime = this.getAfterTimeMonth(currentTimeView);
          this.getListEvents(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsPrev()
          this.filterAllTodayDate();
        }
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextMonth(currentTimeView);
        this.getListEventsPrevMonth(currentTimeView);
        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
        currentTimeView = this.getAfterTimeDay(currentTimeView);
        this.events = this.scotSrv.getListServiceCallOutagePrev();
        this.getAssociationVisiableFromPrev();
        if ((this.events === null) || (this.events == [])) {
          beforeTime = this.getBeforeTimeDay(currentTimeView);
          afterTime = this.getAfterTimeDay(currentTimeView);
          this.getListEvents(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsPrev()
          this.filterAllTodayDate();
        }
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextDay(currentTimeView);
        this.getListEventsPrevDay(currentTimeView);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleNextClick = (e, fc) => {
    this.disableButton();
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
        // get association visiable from prev
        this.getAssociationVisiableFromNext();
        if (this.events === null || (this.events == [])) {
          beforeTime = this.getBeforeTimeMonth(currentTimeView);
          afterTime = this.getAfterTimeMonth(currentTimeView);
          this.getListEvents(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsNext()
          this.filterAllTodayDate();
        }
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextMonth(currentTimeView);
        this.getListEventsPrevMonth(currentTimeView);
        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
      // can lau dc ngay dang hien thi
        currentTimeView = this.getBeforeTimeDay(currentTimeView);
        this.events = this.scotSrv.getListServiceCallOutageNext();
        this.getAssociationVisiableFromNext();
        if ((this.events === null) || (this.events == [])) {
          beforeTime = this.getBeforeTimeDay(currentTimeView);
          afterTime = this.getAfterTimeDay(currentTimeView);
          this.getListEvents(afterTime, beforeTime, range);
        } else {
          this.listEvents = this.scotSrv.getListEventsNext()
          this.filterAllTodayDate();
        }
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextDay(currentTimeView);
        this.getListEventsPrevDay(currentTimeView);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleTodayClick = (e, fc) => {
    this.disableButton();
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
          this.getListEvents(afterTime, beforeTime, range);
        // } else {
        //   this.listEvents = this.scotSrv.getListEventsNextMonth()
        // }
        this.events = [];
        this.listEvents = [];
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextMonth(currentTimeView);
        this.getListEventsPrevMonth(currentTimeView);
        break;
      // week
      case 'agendaWeek':
        
        break;
      // day
      default:
        beforeTime = this.getBeforeTimeDay(currentTimeView);
        afterTime = this.getAfterTimeDay(currentTimeView);
        this.getListEvents(afterTime, beforeTime, range);
        this.events = [];
        this.listEvents = [];
        this.setListServiceCallOutage(this.events);
        this.setListEvents(this.listEvents);
        this.getListEventsNextDay(currentTimeView);
        this.getListEventsPrevDay(currentTimeView);
        break;
    }
    this.setCurrentTimeView(currentTimeView);
  }
  
  handleMonthClick = (e, fc) => {
    let currentView = this.getCurrentView();
    if (currentView != 'month') {
      this.disableButton();
      fc.calendar.changeView('month');
      this.setCurrentView('month');
      let currentTimeView = this.getCurrentTimeView();
      let beforeTime;
      let afterTime;
      let range = 'visible';
      beforeTime = this.getBeforeTimeMonth(currentTimeView);
      afterTime = this.getAfterTimeMonth(currentTimeView);
      this.getListEvents(afterTime, beforeTime, range);
      this.events = [];
      this.listEvents = [];
      this.setListServiceCallOutage(this.events);
      this.setListEvents(this.listEvents);
      this.initListEvents(afterTime, beforeTime);
      this.getListEventsNextMonth(currentTimeView);
      this.getListEventsPrevMonth(currentTimeView);
    }
  }
  
  handleAgendaWeekClick = (e, fc) => {
    console.log('handle week click', new Date(e));
    console.log('fc', fc.calendar.getDate());
    let currentView = this.getCurrentView();
    if (currentView != 'agendaWeek') {
      // this.disableButton();
      fc.calendar.changeView('agendaWeek');
      this.setCurrentView('agendaWeek');
      // set Tuan dau tien trong thang
    }
  }
  
  handleAgendaDayClick = (e, fc) => {
    let currentView = this.getCurrentView();
    let currentTimeView = fc.calendar.getDate();
    if (currentView != 'agendaDay') {
      this.disableButton();
      fc.calendar.changeView('agendaDay');
      this.setCurrentView('agendaDay');
      this.setCurrentTimeView(currentTimeView);
      let beforeTime;
      let afterTime;
      let range = 'visible';
      beforeTime = this.getBeforeTimeDay(currentTimeView);
      afterTime = this.getAfterTimeDay(currentTimeView);
      
      this.getListEvents(afterTime, beforeTime, range);
      this.events = [];
      this.listEvents = [];
      this.setListServiceCallOutage(this.events);
      this.setListEvents(this.listEvents);
      this.initListEvents(afterTime, beforeTime);
      this.getListEventsNextDay(currentTimeView);
      this.getListEventsPrevDay(currentTimeView);
    }
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
    this.disableButton();
    let date;
    date = new Date(event);
    selectedDate.calendar.gotoDate(date);
    this.setCurrentTimeView(date);
    let beforeTime;
    let afterTime;
    let currentView = this.getCurrentView();
    switch (currentView) {
      case 'month':
        beforeTime = this.getBeforeTimeMonth(date);
        afterTime = this.getAfterTimeMonth(date);
        this.events = [];
        this.listEvents = [];
        this.setListServiceCallOutage([]);
        this.setListEvents([]);
        this.initListEvents(afterTime, beforeTime);
        this.getListEventsNextMonth(date);
        this.getListEventsPrevMonth(date);
        break;
      case 'agendaweek':

        break;
      default:
        beforeTime = this.getBeforeTimeDay(date);
        afterTime = this.getAfterTimeDay(date);
        this.events = [];
        this.listEvents = [];
        this.setListServiceCallOutage([]);
        this.setListEvents([]);
        console.log('date: ', date);
        console.log('beforeTime: ', beforeTime);
        this.initListEvents(date, beforeTime);
        this.getListEventsNextDay(beforeTime);
        this.getListEventsPrevDay(afterTime);
        break;
    }

    // week
    // day
  }

  //#region general SCs and OTs
  // init SCs and outages
  async getListEvents(startTime, endTime, range) {
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
            resolve(data['total']);
          });
        });
        this.getListPageOutages(listPages, totalOutage, start, end);

        // get Services
        totalService  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}tsservices/fetch?time_after=${start}&time_before=${end}`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        this.getListPageServiceCalls(listPages, totalService, start, end);
        
        // fetch all OTs and SCs visiable range
        this.getOutageServiceCallFromAPI(listPages, range);
      } catch (error) {
        throw error;
      }

    // if ((this.listCreatorEditor = this.creatorEditorSrv.getListCreatorEditor()) == null) {
    //   this.getCreatorEditor(listPages);
    // }
  }

  // init SCs and outages
  async getListTodoMain() {
    let listPages: any;
    listPages = [];
    this.events = this.scotSrv.getListServiceCallOutage();
    let totalTodoMain;
    try {
      //get TodoMain
      totalTodoMain = await new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}todomains/fetch?ids=${1}`, httpOptions).subscribe(data => {
          console.log('todo main:', data);
          resolve(data);
        })
      })
      // this.getListPageTodoMain();
      // this.getTodoMainFromAPI(listPages);
    } catch (error) {
      throw error;
    }
  }

  // init List Events visiable range
  initListEvents(startTime, endTime) {
    let range = 'visible';
    this.events = this.scotSrv.getListServiceCallOutage();
    if (this.events === null || this.events.length == 0) {
      this.getListEvents(startTime, endTime, range);
    } else {
      this.listEvents = this.scotSrv.getListEvents();
      this.filterAllTodayDate();
    }
  }

  // get List Events prev month
  getListEventsPrevMonth(currentTimeView) {
    let beforeTime;
    let afterTime;
    let range = 'prev';
    currentTimeView = this.getAfterTimeMonth(currentTimeView);
    beforeTime = this.getBeforeTimeMonth(currentTimeView);
    afterTime = this.getAfterTimeMonth(currentTimeView);
    this.getListEvents(afterTime, beforeTime, range);
  }

  // get List Events next month
  getListEventsNextMonth(currentTimeView) {
    let beforeTime;
    let afterTime;
    let range = 'next';
    // if ((this.eventsNext = this.scotSrv.getListServiceCallOutageNext()) == null) {
      currentTimeView = this.getBeforeTimeMonth(currentTimeView);
      beforeTime = this.getBeforeTimeMonth(currentTimeView);
      afterTime = this.getAfterTimeMonth(currentTimeView);
      this.getListEvents(afterTime, beforeTime, range);
    // } else {
    //   this.listEventsNext = this.scotSrv.getListEventsNextMonth()
    // }
  }

  // get List Events prev day
  getListEventsPrevDay(currentTimeView) {
    let beforeTime;
    // let afterTime;
    let range = 'prev';
    currentTimeView = this.getAfterTimeDay(currentTimeView);
    beforeTime = this.getBeforeTimeDay(currentTimeView);
    // afterTime = this.getAfterTimeDay(currentTimeView);
    this.getListEvents(currentTimeView, beforeTime, range);
  }

  // get List Events next day
  getListEventsNextDay(currentTimeView) {
    let beforeTime;
    // let afterTime;
    let range = 'next';
    currentTimeView = this.getBeforeTimeDay(currentTimeView);
    beforeTime = this.getBeforeTimeDay(currentTimeView);
    // afterTime = this.getAfterTimeDay(currentTimeView);
    this.getListEvents(currentTimeView, beforeTime, range);
  }

  private setListServiceCallOutage(events) {
    let key = 'locSCOT';
    sessionStorage.setItem(key, JSON.stringify(events));
  }

  private setListEvents(events) {
    let key = 'locListEvents';
    sessionStorage.setItem(key, JSON.stringify(events));
  }

  private getListPageOutages(listPages, totalOutage, start, end) {
    let pages = Math.ceil(totalOutage /20);
    let tmp;
    for (let page = 1; page <= pages; page++) {
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsoutages/fetch?time_after=${start}&time_before=${end}&page=${page}`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
  }

  private getListPageServiceCalls(listPages, totalService, startTime, endTime) {
    // get total Services
    let pages = Math.ceil(totalService /20);
    let tmp;
    for (let page = 1; page <= pages; page++) {
      tmp = new Promise((resolve, reject) => {
        this.http.get(`${Config.api_endpoint}tsservices/fetch?time_after=${startTime}&time_before=${endTime}&page=${page}`, httpOptions).subscribe(data => {
          resolve(data);
        });
      });
      listPages.push(tmp);
    }
  }

  getOutageServiceCallFromAPI(listPages, range) {
    switch (range) {
      case 'visible':
        this.getOTSCVisiable(listPages);
        break;
      case 'prev':
        this.getOTSCPrev(listPages);
        break;
      default:
        this.getOTSCNext(listPages);
        break;
    }
  }

  getOTSCVisiable(listPages) {
    let itemServiceCallOutage: IEvent;
    let keySCOT;
    let keyListEvents;
    keySCOT = 'locSCOT';
    keyListEvents = 'locListEvents';
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
      this.getAssociation(this.listEvents);
    });
  }

  getAssociation(eventsPrev) {
    // general
    let listDeviceplaceholder = [];
    let listPlant = [];
    let listTicket = [];
    // association service call
    let listActionrequest = [];
    let listSCTeam = [];
    let listSCTask = [];
    let listPeople = [];
    // association outage
    let listOTCategory = [];

    // let listOTCreator = [];
    // let listOTModifier = [];
    // let listSCCreator = [];
    // let listSCModifier = [];
    eventsPrev.forEach(e => {
      if (e.plantID !== null) {
        listPlant.push(e.plantID);
      }
      if (e.tsticketID !== null) {
        listTicket.push(e.tsticketID);
      }
      if (e.listDeviceplaceholder !== null) {
        listDeviceplaceholder.push(e.deviceplaceholderID);
      }
      switch (e.typeOfEvent) {
        case 'ServiceCall':
          if (e.tsactionrequestID !== null) {
            listActionrequest.push(e.tsactionrequestID);
          }
          if (e.creatorPersonID !== null) {
            listPeople.push(e.creatorPersonID);
          }
          if (e.modifierPersonID !== null) {
            listPeople.push(e.modifierPersonID);
          }
          if (e.teamID !== null) {
            listSCTask.push(e.teamID);
          }
          if (e.listTasksID !== null) {
            listSCTask = listSCTask.concat(e.creatorPersonID);
            listSCTask = listSCTask.filter(function(task, index, self) {
              return index === self.indexOf(task);
            })
          }
          if (e.listPeopleID !== null) {
            listPeople = listPeople.concat(e.listPeopleID);
          }
          break;
        default:
          if (e.tsoutagecategoryID !== null) {
            listOTCategory.push(e.tsoutagecategoryID);
          }
          if (e.creatorID !== null) {
            listPeople.push(e.creatorID);
          }
          if (e.modifierID !== null) {
            listPeople.push(e.modifierID);
          }
          break;
      }
      listPeople = listPeople.filter(function(people, index, self) {
        return index === self.indexOf(people);
      })
    });
    let key;
    key = 'locAssociationDeviceplaceholdersVisiable';
    this.setAssociationDeviceplaceholder(listDeviceplaceholder, key);
    key = 'locAssociationTicketsVisiable';
    this.setAssociationTicket(listTicket, key);
    key = 'locAssociationActionrequestsVisiable';
    this.setAssociationActionrequest(listActionrequest, key);
    key = 'locAssociationSCCreatorsVisiable';
    key = 'locAssociationSCTeamVisiable';
    this.setAssociationTeam(listSCTeam, key);
    key = 'locAssociationSCTaskVisiable';
    this.setAssociationTask(listSCTask, key);
    key = 'locAssociationOTCategoriesVisiable';
    this.setAssociationOTCategory(listOTCategory, key);
    key = 'locAssociationPeopleVisiable';
    this.setAssociationPeople(listPeople, key);
    key = 'locAssociationPlantsVisiable';
    this.setAssociationPlant(listPlant, key);

    // key = 'locAssociationOTCreatorsVisiable';
    // this.setAssociationOTCreator(listOTCreator, key);
    // key = 'locAssociationOTModifiersVisiable';
    // this.setAssociationOTModifier(listOTModifier, key);
    // this.setAssociationSCCreator(listSCCreator, key);
    // key = 'locAssociationSCModifiersVisiable';
    // this.setAssociationSCModifier(listSCModifier, key);
  }

  getAssociationVisiableFromPrev() {
    let key;
    let listItems;
    key = 'locAssociationPlantsPrev';
    listItems = this.associationSrv.getListPlants(key);
    key = 'locAssociationPlantsVisiable';
    this.associationSrv.setListPlants(listItems, key);

    key = 'locAssociationDeviceplaceholdersPrev';
    listItems = this.associationSrv.getListDeviceplaceholders(key);
    key = 'locAssociationDeviceplaceholdersVisiable';
    this.associationSrv.setListDeviceplaceholders(listItems, key);
    
    key = 'locAssociationTicketsPrev';
    listItems = this.associationSrv.getListTickets(key);
    key = 'locAssociationTicketsVisiable';
    this.associationSrv.setListTickets(listItems, key);
    
    key = 'locAssociationActionrequestsPrev';
    listItems = this.associationSrv.getListActionrequests(key);
    key = 'locAssociationActionrequestsVisiable';
    this.associationSrv.setListActionrequests(listItems, key);
    
    key = 'locAssociationSCTeamPrev';
    listItems = this.associationSrv.getListSCTeams(key);
    key = 'locAssociationSCTeamVisiable';
    this.associationSrv.setListSCTeams(listItems, key);

    key = 'locAssociationSCTaskPrev';
    listItems = this.associationSrv.getListSCTasks(key);
    key = 'locAssociationSCTaskVisiable';
    this.associationSrv.setListSCTasks(listItems, key);

    key = 'locAssociationPeoplePrev';
    listItems = this.associationSrv.getListPeople(key);
    key = 'locAssociationPeopleVisiable';
    this.associationSrv.setListPeople(listItems, key);

    key = 'locAssociationOTCategoriesPrev';
    listItems = this.associationSrv.getListOTCategories(key);
    key = 'locAssociationOTCategoriesVisiable';
    this.associationSrv.setListOTCategories(listItems, key);

    // key = 'locAssociationOTCreatorsPrev';
    // this.setAssociationOTCreator(listOTCreator, key);
    // key = 'locAssociationOTModifiersPrev';
    // this.setAssociationOTModifier(listOTModifier, key);
    // key = 'locAssociationSCCreatorsPrev';
    // this.setAssociationSCCreator(listSCCreator, key);
    // key = 'locAssociationSCModifiersPrev';
    // this.setAssociationSCModifier(listSCModifier, key);
  }
  
  getAssociationVisiableFromNext() {
    let key;
    let listItems;
    key = 'locAssociationPlantsNext';
    listItems = this.associationSrv.getListPlants(key);
    key = 'locAssociationPlantsVisiable';
    this.associationSrv.setListPlants(listItems, key);

    key = 'locAssociationDeviceplaceholdersNext';
    listItems = this.associationSrv.getListDeviceplaceholders(key);
    key = 'locAssociationDeviceplaceholdersVisiable';
    this.associationSrv.setListDeviceplaceholders(listItems, key);
    
    key = 'locAssociationTicketsNext';
    listItems = this.associationSrv.getListTickets(key);
    key = 'locAssociationTicketsVisiable';
    this.associationSrv.setListTickets(listItems, key);
    
    key = 'locAssociationActionrequestsNext';
    listItems = this.associationSrv.getListActionrequests(key);
    key = 'locAssociationActionrequestsVisiable';
    this.associationSrv.setListActionrequests(listItems, key);
    
    key = 'locAssociationSCTeamNext';
    listItems = this.associationSrv.getListSCTeams(key);
    key = 'locAssociationSCTeamVisiable';
    this.associationSrv.setListSCTeams(listItems, key);

    key = 'locAssociationSCTaskNext';
    listItems = this.associationSrv.getListSCTasks(key);
    key = 'locAssociationSCTaskVisiable';
    this.associationSrv.setListSCTasks(listItems, key);

    key = 'locAssociationPeopleNext';
    listItems = this.associationSrv.getListPeople(key);
    key = 'locAssociationPeopleVisiable';
    this.associationSrv.setListPeople(listItems, key);

    key = 'locAssociationOTCategoriesNext';
    listItems = this.associationSrv.getListOTCategories(key);
    key = 'locAssociationOTCategoriesVisiable';
    this.associationSrv.setListOTCategories(listItems, key);

    // key = 'locAssociationOTCreatorsPrev';
    // this.setAssociationOTCreator(listOTCreator, key);
    // key = 'locAssociationOTModifiersPrev';
    // this.setAssociationOTModifier(listOTModifier, key);
    // key = 'locAssociationSCCreatorsPrev';
    // this.setAssociationSCCreator(listSCCreator, key);
    // key = 'locAssociationSCModifiersPrev';
    // this.setAssociationSCModifier(listSCModifier, key);
    
  }

  getOTSCPrev(listPages) {
    let itemServiceCallOutage: IEvent;
    let keySCOT;
    let keyListEvents;
    keySCOT = 'locSCOTPrev';
    keyListEvents = 'locListEventsPrev';
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
      this.getAssociationPrev(this.listEventsPrev);
    });
  }

  // get association prev from API to session
  getAssociationPrev(eventsPrev) {
    // general
    let listDeviceplaceholder = [];
    let listPlant = [];
    let listTicket = [];
    // association service call
    let listActionrequest = [];
    let listSCTeam = [];
    let listSCTask = [];
    let listPeople = [];
    // association outage
    let listOTCategory = [];
    // let listOTCreator = [];
    // let listOTModifier = [];
    // let listSCCreator = [];
    // let listSCModifier = [];
    eventsPrev.forEach(e => {
      if (e.plantID !== null) {
        listPlant.push(e.plantID);
      }
      if (e.tsticketID !== null) {
        listTicket.push(e.tsticketID);
      }
      if (e.listDeviceplaceholder !== null) {
        listDeviceplaceholder.push(e.deviceplaceholderID);
      }
      switch (e.typeOfEvent) {
        case 'ServiceCall':
          if (e.tsactionrequestID !== null) {
            listActionrequest.push(e.tsactionrequestID);
          }
          if (e.creatorPersonID !== null) {
            listPeople.push(e.creatorPersonID);
          }
          if (e.modifierPersonID !== null) {
            listPeople.push(e.modifierPersonID);
          }
          if (e.teamID !== null) {
            listSCTask.push(e.teamID);
          }
          if (e.listTasksID !== null) {
            listSCTask = listSCTask.concat(e.creatorPersonID);
            listSCTask = listSCTask.filter(function(task, index, self) {
              return index === self.indexOf(task);
            })
          }
          if (e.listPeopleID !== null) {
            listPeople = listPeople.concat(e.listPeopleID);
          }
          break;
        default:
          if (e.tsoutagecategoryID !== null) {
            listOTCategory.push(e.tsoutagecategoryID);
          }
          if (e.creatorID !== null) {
            listPeople.push(e.creatorID);
          }
          if (e.modifierID !== null) {
            listPeople.push(e.modifierID);
          }
          break;
      }
      listPeople = listPeople.filter(function(people, index, self) {
        return index === self.indexOf(people);
      })
    });
    let key;
    key = 'locAssociationDeviceplaceholdersPrev';
    this.setAssociationDeviceplaceholder(listDeviceplaceholder, key);
    key = 'locAssociationTicketsPrev';
    this.setAssociationTicket(listTicket, key);
    key = 'locAssociationActionrequestsPrev';
    this.setAssociationActionrequest(listActionrequest, key);
    key = 'locAssociationSCTeamPrev';
    this.setAssociationTeam(listSCTeam, key);
    key = 'locAssociationSCTaskPrev';
    this.setAssociationTask(listSCTask, key);
    key = 'locAssociationPeoplePrev';
    this.setAssociationPeople(listPeople, key);
    key = 'locAssociationOTCategoriesPrev';
    this.setAssociationOTCategory(listOTCategory, key);
    key = 'locAssociationPlantsPrev';
    this.setAssociationPlantPrev(listPlant, key);

    // key = 'locAssociationOTCreatorsPrev';
    // this.setAssociationOTCreator(listOTCreator, key);
    // key = 'locAssociationOTModifiersPrev';
    // this.setAssociationOTModifier(listOTModifier, key);
    // key = 'locAssociationSCCreatorsPrev';
    // this.setAssociationSCCreator(listSCCreator, key);
    // key = 'locAssociationSCModifiersPrev';
    // this.setAssociationSCModifier(listSCModifier, key);
  }

  getOTSCNext(listPages) {
    let itemServiceCallOutage: IEvent;
    let keySCOT;
    let keyListEvents;
    keySCOT = 'locSCOTNext';
    keyListEvents = 'locListEventsNext';
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
      this.getAssociationNext(this.listEventsNext);
    });
  }

  getAssociationNext(eventsNext) {
    // general
    let listDeviceplaceholder = [];
    let listPlant = [];
    let listTicket = [];
    // association service call
    let listActionrequest = [];
    let listSCTeam = [];
    let listSCTask = [];
    let listPeople = [];
    // association outage
    let listOTCategory = [];
    // let listOTCreator = [];
    // let listOTModifier = [];
    // let listSCCreator = [];
    // let listSCModifier = [];
    eventsNext.forEach(e => {
      if (e.plantID !== null) {
        listPlant.push(e.plantID);
      }
      if (e.tsticketID !== null) {
        listTicket.push(e.tsticketID);
      }
      if (e.listDeviceplaceholder !== null) {
        listDeviceplaceholder.push(e.deviceplaceholderID);
      }
      switch (e.typeOfEvent) {
        case 'ServiceCall':
          if (e.tsactionrequestID !== null) {
            listActionrequest.push(e.tsactionrequestID);
          }
          if (e.creatorPersonID !== null) {
            listPeople.push(e.creatorPersonID);
          }
          if (e.modifierPersonID !== null) {
            listPeople.push(e.modifierPersonID);
          }
          if (e.teamID !== null) {
            listSCTask.push(e.teamID);
          }
          if (e.listTasksID !== null) {
            listSCTask = listSCTask.concat(e.creatorPersonID);
            listSCTask = listSCTask.filter(function(task, index, self) {
              return index === self.indexOf(task);
            })
          }
          if (e.listPeopleID !== null) {
            listPeople = listPeople.concat(e.listPeopleID);
          }
          break;
        default:
          if (e.tsoutagecategoryID !== null) {
            listOTCategory.push(e.tsoutagecategoryID);
          }
          if (e.creatorID !== null) {
            listPeople.push(e.creatorID);
          }
          if (e.modifierID !== null) {
            listPeople.push(e.modifierID);
          }
          break;
      }
      listPeople = listPeople.filter(function(people, index, self) {
        return index === self.indexOf(people);
      })
    });
    let key;
    key = 'locAssociationDeviceplaceholdersNext';
    this.setAssociationDeviceplaceholder(listDeviceplaceholder, key);
    key = 'locAssociationTicketsNext';
    this.setAssociationTicket(listTicket, key);
    key = 'locAssociationActionrequestsNext';
    this.setAssociationActionrequest(listActionrequest, key);
    key = 'locAssociationSCCreatorsNext';
    key = 'locAssociationSCTeamNext';
    this.setAssociationTeam(listSCTeam, key);
    key = 'locAssociationSCTaskNext';
    this.setAssociationTask(listSCTask, key);
    key = 'locAssociationOTCategoriesNext';
    this.setAssociationOTCategory(listOTCategory, key);
    key = 'locAssociationPeopleNext';
    this.setAssociationPeople(listPeople, key);
    key = 'locAssociationPlantsNext';
    this.setAssociationPlant(listPlant, key);

    // key = 'locAssociationOTCreatorsNext';
    // this.setAssociationOTCreator(listOTCreator, key);
    // key = 'locAssociationOTModifiersNext';
    // this.setAssociationOTModifier(listOTModifier, key);
    // this.setAssociationSCCreator(listSCCreator, key);
    // key = 'locAssociationSCModifiersNext';
    // this.setAssociationSCModifier(listSCModifier, key);
  }

  //#region get Associations
  setAssociationPlant(listPlant, key) {
    if (listPlant.length != 0) {
      this.associationSrv.getPlants(listPlant).subscribe(plant => {
        sessionStorage.setItem(key, JSON.stringify(plant['data']));
        this.filterAllTodayDate();
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
      this.filterAllTodayDate();
    }
  }

  setAssociationPlantPrev(listPlant, key) {
    if (listPlant.length != 0) {
      this.associationSrv.getPlants(listPlant).subscribe(plant => {
        sessionStorage.setItem(key, JSON.stringify(plant['data']));
        this.enableButton();
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
      this.enableButton();
    }
  }

  setAssociationDeviceplaceholder(listDeviceplaceholder, key) {
    if (listDeviceplaceholder.length != 0) {
      this.associationSrv.getDeviceplaceholders(listDeviceplaceholder).subscribe(device => {
        sessionStorage.setItem(key, JSON.stringify(device['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  setAssociationTicket(listTicket, key) {
    if (listTicket.length != 0) {
      this.associationSrv.getTickets(listTicket).subscribe(ticket => {
        sessionStorage.setItem(key, JSON.stringify(ticket['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  setAssociationActionrequest(listActionrequest, key) {
    if (listActionrequest.length != 0) {
      this.associationSrv.getActionrequests(listActionrequest).subscribe(actionrequest => {
        sessionStorage.setItem(key, JSON.stringify(actionrequest['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  // setAssociationSCCreator(listSCCreator, key) {
  //   if (listSCCreator.length != 0) {
  //     this.associationSrv.getSCCreators(listSCCreator).subscribe(creator => {
  //       sessionStorage.setItem(key, JSON.stringify(creator['data']));
  //     });
  //   } else {
  //     sessionStorage.setItem(key, JSON.stringify(''));
  //   }
  // }

  // setAssociationSCModifier(listSCModifier, key) {
  //   if (listSCModifier.length != 0) {
  //     this.associationSrv.getSCModifiers(listSCModifier).subscribe(modifier => {
  //       sessionStorage.setItem(key, JSON.stringify(modifier['data']));
  //     });
  //   } else {
  //     sessionStorage.setItem(key, JSON.stringify(''));
  //   }
  // }

  setAssociationTeam(listSCTeam, key) {
    if (listSCTeam.length != 0) {
      this.associationSrv.getSCTeams(listSCTeam).subscribe(team => {
        sessionStorage.setItem(key, JSON.stringify(team['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  setAssociationTask(listTask, key) {
    if (listTask.length != 0) {
      this.associationSrv.getSCTasks(listTask).subscribe(task => {
        sessionStorage.setItem(key, JSON.stringify(task['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  setAssociationPeople(listPeople, key) {
    if (listPeople.length != 0) {
      this.associationSrv.getSCPeople(listPeople).subscribe(p => {
        sessionStorage.setItem(key, JSON.stringify(p['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  setAssociationOTCategory(listOTCategory, key) {
    if (listOTCategory.length != 0) {
      this.associationSrv.getOTCategories(listOTCategory).subscribe(otCategory => {
        sessionStorage.setItem(key, JSON.stringify(otCategory['data']));
      });
    } else {
      sessionStorage.setItem(key, JSON.stringify(''));
    }
  }

  // setAssociationOTCreator(listOTCreator, key) {
  //   if (listOTCreator.length != 0) {
  //     this.associationSrv.getOTCreators(listOTCreator).subscribe(otCreator => {
  //       sessionStorage.setItem(key, JSON.stringify(otCreator['data']));
  //     });
  //   } else {
  //     sessionStorage.setItem(key, JSON.stringify(''));
  //   }
  // }

  // setAssociationOTModifier(listOTModifier, key) {
  //   if (listOTModifier.length != 0) {
  //     this.associationSrv.getOTModifiers(listOTModifier).subscribe(otModifier => {
  //       sessionStorage.setItem(key, JSON.stringify(otModifier['data']));
  //     });
  //   } else {
  //     sessionStorage.setItem(key, JSON.stringify(''));
  //   }
  // }
  //#endregion

  private getCreatorEditor(listPages) {
    let itemCreatorEditor;
    let key;
    key = 'locCreatorEditor';
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

  async initCreatorEditor() {
    let key;
    key = 'locCreatorEditor';
    if ((this.listCreatorEditor = this.creatorEditorSrv.getListCreatorEditor()) == null) {
      let listPages: any;
      listPages = [];
      let totalCreatorEditer;
      try {
        // get total tickets
        totalCreatorEditer  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}people/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        
        let pages = Math.ceil(totalCreatorEditer /20);
        let tmp;
        for (let page = 1; page <= pages; page++) {
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}people/fetch?page=${page}`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
          this.listCreatorEditor = [];
          rs.forEach(people => {
            people['data'].forEach(p => {
              this.listCreatorEditor.push(p);
            });
          });
          sessionStorage.setItem(key, JSON.stringify(this.listCreatorEditor));
        });
      } catch (error) {
        throw error;
      }
    }
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

  async initListOutageCategories() {
    let key;
    key = 'locOutageCategory';
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
        let pages = Math.ceil(totalOutageCategory /20);
        let tmp;
        for (let page = 1; page <= pages; page++) {
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}tsoutages/fetch?page=${page}`, httpOptions).subscribe(data => {
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
    key = 'locTicket';
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
        
        let pages = Math.ceil(totalTicket /20);
        let tmp;
        for (let page = 1; page <= pages; page++) {
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}tstickets/fetch?page=${page}`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
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
  async initListPlants() {
    let key = 'locPlant';
    if ((this.listPlants = this.plantsSrv.getListPlants()) == null) {
      let listPages: any;
      listPages = [];
      let totalPlant;
      try {
        // get total tickets
        totalPlant  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}plants/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        
        let pages = Math.ceil(totalPlant /20);
        let tmp;
        for (let page = 1; page <= pages; page++) {
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}plants/fetch?page=${page}`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
          this.listPlants = [];
          rs.forEach(plants => {
            plants['data'].forEach(plant => {
              this.listPlants.push(plant);
            });
          });
          sessionStorage.setItem(key, JSON.stringify(this.listPlants));
        });
      } catch (error) {
        throw error;
      }
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

    key = 'locChangesFeed';
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
        key = 'locPlant';
        this.plantsSrv.getPlants(data.entity_id).subscribe(plant => {
          this.listPlants = this.listPlants.map((p)=>{
            if (p.id === data.entity_id) {
              return false;
             }
            return p;
          }).filter(p => p != false);
          this.listPlants.push(plant['data'][0]);
          sessionStorage.setItem(key, JSON.stringify(this.listPlants));
        });
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
    key = 'locParticipatingPeople';
    if ((this.listParticipatingPeople = this.participatingPeopleSrv.getListParticipatingPeople()) == null) {
      let listPages: any;
      listPages = [];
      let totalPerson;
      try {
        // get total Outages
        totalPerson  = await new Promise((resolve, reject) => {
          this.http.get(`${Config.api_endpoint}people/fetch`, httpOptions).subscribe(data => {
            resolve(data['total']);
          });
        });
        let pages = Math.ceil(totalPerson /20);
        let tmp;
        for (let page = 1; page <= pages; page++) {
          tmp = new Promise((resolve, reject) => {
            this.http.get(`${Config.api_endpoint}people/fetch?page=${page}`, httpOptions).subscribe(data => {
              resolve(data);
            });
          });
          listPages.push(tmp);
        }

        Promise.all(listPages).then(rs => {
          this.listParticipatingPeople = [];
          rs.forEach(people => {
            people['data'].forEach(p => {
              this.listParticipatingPeople.push(p);
            });
          });
          sessionStorage.setItem(key, JSON.stringify(this.listParticipatingPeople));
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

  // filter by plants
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
        this.eventsPrev = this.eventsPrev.filter(function(e){
          return this.indexOf(e.plantID) >= 0;
        }, listID);
        this.eventsNext = this.eventsNext.filter(function(e){
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
        // this.events.forEach( e => {
        // })
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
            if ((e.creatorPersonID !== undefined
              && e.creatorPersonID !== null)
              || (e.modifierPersonID !== undefined
              && e.modifierPersonID !== null)) {
                return (this.indexOf(e.creatorPersonID) >= 0)
                        || (this.indexOf(e.modifierPersonID) >= 0);
            }
          }
        }, listID);
        this.eventsPrev = this.eventsPrev.filter(function(e){
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
            if ((e.creatorPersonID !== undefined
              && e.creatorPersonID !== null)
              || (e.modifierPersonID !== undefined
              && e.modifierPersonID !== null)) {
                return (this.indexOf(e.creatorPersonID) >= 0)
                        || (this.indexOf(e.modifierPersonID) >= 0);
            }
          }
        }, listID);
        this.eventsNext = this.eventsNext.filter(function(e){
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
            if ((e.creatorPersonID !== undefined
              && e.creatorPersonID !== null)
              || (e.modifierPersonID !== undefined
              && e.modifierPersonID !== null)) {
                return (this.indexOf(e.creatorPersonID) >= 0)
                        || (this.indexOf(e.modifierPersonID) >= 0);
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
        this.eventsPrev = this.eventsPrev.filter(e => {
          let timeStart = new Date(e.start);
          return this.timeStart <= timeStart;
        });
        this.eventsNext = this.eventsNext.filter(e => {
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
      this.eventsPrev = this.eventsPrev.filter(e => {
        let timeEnd = new Date(e.end);
        return this.timeEnd >= timeEnd;
      });
      this.eventsNext = this.eventsNext.filter(e => {
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
      this.eventsPrev = this.eventsPrev.filter(e => {
        let timeStart = new Date(e.start);
        let timeEnd = new Date(e.end);
        return (this.timeStart <= timeStart) && (this.timeEnd >= timeEnd);
      });
      this.eventsNext = this.eventsNext.filter(e => {
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
        this.eventsPrev = this.eventsPrev.filter(function(e){
          if (e.typeOfEvent === "Outage") {
            return this.indexOf(e.eventOutage.tsoutagecategory.id) >= 0;
          }
          return true;
        }, listID);
        this.eventsNext = this.eventsNext.filter(function(e){
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
        this.eventsPrev = this.eventsPrev.filter(function(e){
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
        this.eventsNext = this.eventsNext.filter(function(e){
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "ServiceCall") {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "ServiceCall") {
              let timeStart = new Date(e.start);
              let timeEnd = new Date(e.end);
              return (timeStart <= today) && (timeEnd >= today);
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "ServiceCall") {
              let timeEnd = new Date(e.end);
              return timeEnd < today;
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "Outage") {
              let timeStart = new Date(e.start);
              return timeStart > today;
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "Outage") {
              let timeStart = new Date(e.start);
              let timeEnd = new Date(e.end);
              return (timeStart <= today) && (timeEnd >= today);
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
          this.eventsPrev = this.eventsPrev.filter(e => {
            if (e.typeOfEvent === "Outage") {
              let timeEnd = new Date(e.end);
              return timeEnd < today;
            }
            return true;
          });
          this.eventsNext = this.eventsNext.filter(e => {
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
  filterAll(eventSelected: any) {
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

  // filter when click today or selected date in calendar
  filterAllTodayDate() {
    this.filterParticipatingPeople();
    this.filterServiceCallStatus();
    this.filterOutagesCategory();
    this.filterOutageStatus();
    this.filterPlants();
    this.filterCreatorEditor();
    this.filterTimeStartEnd();
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
