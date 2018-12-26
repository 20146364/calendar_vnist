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

    expectedBegin: string;
    expectedEnd: string;
    comment: any;
    tsticketID: string;
    outageCategory: string;

    event: any;
    /**
     *
     */
    constructor() {
    }

    getInfo(ot: any) {
        this.event = ot;
        this.id = ot.id;
        this.title = ot.id;
        this.start = new Date(ot.begin ? ot.begin : ot.expectedbegin);
        this.end = new Date(ot.end ? ot.end : ot.expectedend);
        this.plantID = ot.plant_id;
        this.expectedBegin = (new Date(ot.expectedbegin)).toLocaleString();
        this.expectedEnd = (new Date(ot.expectedend)).toLocaleString();
        this.comment = ot.comment;
        this.tsticketID = ot.tsticket_id;
        this.outageCategory = ot.tsoutagecategory.name;
    }

  }
