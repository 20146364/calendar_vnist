import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: any;
    title: any;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    _plantName: any;
    plantID: any;
    typeOfEvent = "ServiceCall";

    plannedBegin: any;
    plannedEnd: any;
    comment: any;
    tsticketID: any;
    _ticketName: any;
    listPeopleID: any[];
    private _listPeople: any[];
    numberOfPeople: any;

    eventServiceCall: any;
    /**
     *
     */
    constructor() {
    }

    initInfo(sc: any) {
        this.color = "#58585a";
        this.eventServiceCall = sc;
        this.id = sc.id;
        this.title = sc.kurzbeschreibung;
        this.start = new Date(sc.done_begin ? sc.done_begin : sc.sheduled_begin);
        this.end = new Date(sc.done_end ? sc.done_end : sc.sheduled_end);
        this.plantID = sc.plant_id;
        this.plantName = sc.plant_id;
        this.plannedBegin = (new Date(sc.sheduled_begin ? sc.sheduled_begin : sc.done_begin)).toLocaleString();
        this.plannedEnd = (new Date(sc.sheduled_end ? sc.sheduled_end : sc.done_end)).toLocaleString();
        this.comment = sc.sheduled_comment;
        this.tsticketID = sc.tsticket_id;
        this.ticketName = sc.tsticket_id;
        if (this.end.getTime() - this.start.getTime() >= 86400000) {
            this.allDay = true;
        }
        if (sc.people !== undefined && sc.people.length !== 0) {
            this.listPeopleID = [];
            sc.people.forEach(p => {
                this.listPeopleID.push(p.id);
            });
            this.numberOfPeople = sc.people.length;
            this.listPeople = this.listPeopleID;
        } else {
            this.listPeople = [];
            this.numberOfPeople = 0;
        }
    }
    
    getInfo(sc: any){
        this.id = sc.id;
        this.title = sc.title;
        this.start = sc.start;
        this.end = sc.end;
        this.plantID = sc.extendedProps.plantID;
        this._plantName = sc.extendedProps._plantName;
        this.plannedBegin = sc.extendedProps.plannedBegin;
        this.plannedEnd = sc.extendedProps.plannedEnd;
        this.comment = sc.extendedProps.comment;
        this.tsticketID = sc.extendedProps.tsticketID;
        this._ticketName = sc.extendedProps._ticketName;
        this.numberOfPeople = sc.extendedProps.numberOfPeople;
        this._listPeople = sc.extendedProps._listPeople;
    }

    get listPeople() {
        return this._listPeople;
    }
    set listPeople(listPeopleID: any[]) {
        let myItem: any;
        let key;
        key = 'localParticipatingPeople';
        myItem = sessionStorage.getItem(key);
        if (myItem !== 'undefined') {
            myItem = JSON.parse(myItem);
            this._listPeople = myItem;
        }
        if (this._listPeople) {
            this._listPeople = this._listPeople.filter(function(e){
                return this.indexOf(e.id) >= 0;
              }, listPeopleID);
        }
    }

    get plantName() {
        return this._plantName;
    }
    set plantName(plantID: any) {
        let myItem: any;
        let key;
        let listPlant: any[];
        key = 'localPlant';
        myItem = sessionStorage.getItem(key);
        if (myItem !== 'undefined') {
            myItem = JSON.parse(myItem);
            listPlant = myItem;
        }
        if (listPlant) {
            this._plantName = listPlant.find( e => e.id == plantID);
            if (this._plantName !== undefined) {
                this._plantName = this._plantName.name;
            }
        }
    }

    get ticketName() {
        return this._ticketName;
    }
    set ticketName(ticketID: any) {
        let myItem: any;
        let key;
        let listTicket: any[];
        key = 'localTicket';
        myItem = sessionStorage.getItem(key);
        if (myItem !== 'undefined') {
            myItem = JSON.parse(myItem);
            listTicket = myItem;
        }
        if (listTicket) {
            this._ticketName = listTicket.find( e => e.id == ticketID);
            if (this._ticketName !== undefined) {
                this._ticketName = this._ticketName.name;
            }
        }
    }
  }
