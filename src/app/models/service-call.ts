import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: any;
    title: any;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    private _plantName: any;
    plantID: any;
    typeOfEvent = "ServiceCall";

    deviceplaceholderID: any;
    tsactionrequestID: any;
    creatorPersonID: any;
    modifierPersonID: any;
    teamID: any;
    listTasksID: any[];
    listPeopleID: any[];
    private _listPeopleID: any[];
    plannedBegin: any;
    plannedEnd: any;
    comment: any;
    tsticketID: any;
    private _ticketName: any;
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
        this.plantID = sc.plant_id;
        this.tsticketID = sc.tsticket_id;
        this.deviceplaceholderID = sc.deviceplaceholder_id;
        this.tsactionrequestID = sc.tsactionrequest_id;
        this.creatorPersonID = sc.creator_person_id;
        this.modifierPersonID = sc.modifier_person_id;
        this.listTasksID = sc.tstasks;
        this.teamID = sc.team_id;

        this.start = new Date(sc.done_begin ? sc.done_begin : sc.sheduled_begin);
        this.end = sc.done_end ? sc.done_end : (sc.sheduled_end ? sc.sheduled_end : new Date())
        this.end = new Date(this.end);
        this.plantName = sc.plant_id;
        this.plannedBegin = (new Date(sc.sheduled_begin ? sc.sheduled_begin : sc.done_begin)).toLocaleString();
        this.plannedEnd = (new Date(sc.sheduled_end ? sc.sheduled_end : sc.done_end)).toLocaleString();
        this.comment = sc.sheduled_comment;
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
        console.log(' get info services call', sc);
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
        this._listPeopleID = sc.extendedProps._listPeopleID;
    }

    get listPeople() {
        return this._listPeopleID;
    }
    set listPeople(listPeopleID: any[]) {
        let myItem: any;
        let key;
        key = 'locParticipatingPeople';
        myItem = sessionStorage.getItem(key);
        if (myItem !== 'undefined') {
            myItem = JSON.parse(myItem);
            this._listPeopleID = myItem;
        }
        if (this._listPeopleID) {
            this._listPeopleID = this._listPeopleID.filter(function(e){
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
        key = 'locPlant';
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
        key = 'locTicket';
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
