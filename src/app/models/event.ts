export interface IEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    allDay: boolean;
    color: string;
    className: string;
    typeOfEvent: string;

    getInfo(event: any);
    initInfo(event: any);
  }
