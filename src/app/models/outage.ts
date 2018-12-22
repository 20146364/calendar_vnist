import { IEvent } from './event';

export class Outage implements IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay = true;
    color: string;
    className: string;
    type: string;

    event: any;
    /**
     *
     */
    constructor(type: string) {
        this.type = type;
    }

    getInfo(ot: any) {
        this.event = ot;
        this.id = ot.id;
        this.title = ot.kurzbeothreibung;
        this.start = ot.begin ? ot.begin : ot.expectedbegin;
        this.end = ot.end ? ot.end : ot.expectedend;
    }

  }
