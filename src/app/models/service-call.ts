import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay = true;
    color: string;
    className: string;
    plant_id: number;
    type: string;

    event: any;
    /**
     *
     */
    constructor(type: string) {
        this.type = type;
    }

    getInfo(sc: any) {
        this.event = sc;
        this.id = sc.id;
        this.title = sc.kurzbeschreibung;
        this.start = sc.done_begin ? sc.done_begin : sc.sheduled_begin;
        this.end = sc.done_end ? sc.done_end : sc.sheduled_end;
        this.plant_id = sc.plant_id;
    }

  }
