import { IEvent } from './event';

export class Outage implements IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    plantID: number;
    _plantName: any;
    typeOfEvent = "Outage";

    expectedBegin: string;
    expectedEnd: string;
    comment: any;
    tsticketID: any;
    _ticketName: any;
    outageCategory: string;

    eventOutage: any;
    /**
     *
     */
    constructor() {
    }

    initInfo(ot: any) {
        this.color = "#dc5e14";
        this.eventOutage = ot;
        this.id = ot.id;
        this.title = ot.id;
        this.start = new Date(ot.begin ? ot.begin : ot.expectedbegin);
        this.end = new Date(ot.end ? ot.end : ot.expectedend);
        this.plantID = ot.plant_id;
        this.plantName = ot.plant_id;
        this.expectedBegin = (new Date(ot.expectedbegin ? ot.expectedbegin : ot.begin)).toLocaleString();
        this.expectedEnd = (new Date(ot.expectedend ? ot.expectedend : ot.end)).toLocaleString();
        this.comment = ot.comment;
        this.tsticketID = ot.tsticket_id;
        this.ticketName = ot.tsticket_id;
        this.outageCategory = ot.tsoutagecategory.name;
        if (this.end.getTime() - this.start.getTime() >= 86400000) {
            this.allDay = true;
        }
    }

    getInfo(ot: any){
        this.id = ot.id;
        this.title = ot.title;
        this.start = ot.start;
        this.end = ot.end;
        this.plantID = ot.extendedProps.plantID;
        this._plantName = ot.extendedProps._plantName;
        this.expectedBegin = ot.extendedProps.expectedBegin;
        this.expectedEnd = ot.extendedProps.expectedEnd;
        this.comment = ot.extendedProps.comment;
        this.tsticketID = ot.extendedProps.tsticketID;
        this._ticketName = ot.extendedProps._ticketName;
        this.outageCategory = ot.extendedProps.outageCategory;
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
