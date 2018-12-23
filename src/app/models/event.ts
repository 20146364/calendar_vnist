export interface IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay;
    color: string;
    className: string;
    event: any;
    plant_id: number;

    getInfo(event: any);
  }
