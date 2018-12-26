import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    plantID: number;

    plannedBegin: string;
    plannedEnd: string;
    comment: any;
    tsticketID: string;
    _people: any;
    numberOfPeople: number;

    event: any;
    /**
     *
     */
    constructor() {
    }

    getInfo(sc: any) {
        this.event = sc;
        this.id = sc.id;
        this.title = sc.kurzbeschreibung;
        this.start = new Date(sc.done_begin ? sc.done_begin : sc.sheduled_begin);
        this.end = new Date(sc.done_end ? sc.done_end : sc.sheduled_end);
        this.plantID = sc.plant_id;
        this.plannedBegin = (new Date(sc.sheduled_begin)).toLocaleString();
        this.plannedEnd = (new Date(sc.sheduled_end)).toLocaleString();
        this.comment = sc.sheduled_comment;
        this.tsticketID = sc.tsticket_id;
        if (sc.people[0] !== undefined) {
            // this.people = sc.people[0].id;
        } else {
            this._people = 'unknown';
        }
        this.numberOfPeople = sc.people.length;
    }

    get people() {
        return this._people;
    }
    set people(people:any) {
        this._people = people;
    }

  }
