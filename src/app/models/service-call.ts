import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    plant_id: number;

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
        this.plant_id = sc.plant_id;
    }

  }
