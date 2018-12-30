import { IEvent } from './event';

export class ServiceCall implements IEvent {
    id: any;
    title: any;
    start: Date;
    end: Date;
    allDay = false;
    color: string;
    className: string;
    plantID: any;
    typeOfEvent = "ServiceCall";

    plannedBegin: any;
    plannedEnd: any;
    comment: any;
    tsticketID: any;
    listPeople: any[];
    _people: any;
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
        this.plannedBegin = (new Date(sc.sheduled_begin)).toLocaleString();
        this.plannedEnd = (new Date(sc.sheduled_end)).toLocaleString();
        this.comment = sc.sheduled_comment;
        this.tsticketID = sc.tsticket_id;
        if (this.end.getTime() - this.start.getTime() >= 86400000) {
            this.allDay = true;
        }
        // if (sc.people !== undefined && sc.people.length !== 0) {
        //     this._people = sc.people[0];
        //     // console.log('sc.poeple', sc.people)
        //     // this.people = sc.people;
        //     // console.log('people from localParticipatingPeople: ', this.people)
        // } else {
        //     this.people = ['unknown'];
        // }
        // this.numberOfPeople = sc.people.length;
    }
    
    getInfo(sc: any){
        console.log('get info scs', sc);
        this.id = sc.id;
        this.title = sc.title;
        this.start = sc.start;
        this.end = sc.end;
        this.plantID = sc.extendedProps.plantID;
        this.plannedBegin = sc.extendedProps.plannedBegin;
        this.plannedEnd = sc.extendedProps.plannedEnd;
        this.comment = sc.extendedProps.comment;
        this.tsticketID = sc.extendedProps.tsticketID;
    }

    get people() {
        return this.listPeople;
    }
    set people(listPeopleID: any[]) {
        let myItem: any;
        let key;
        key = 'localParticipatingPeople';
        myItem = sessionStorage.getItem(key);
        if (myItem !== 'undefined') {
            myItem = JSON.parse(myItem);
            this.listPeople = myItem;
        }
        console.log('sesion storage', sessionStorage);
        console.log('list people filter out', this.listPeople);
        if (this.listPeople) {
            console.log('people ID', listPeopleID);
            this.listPeople = this.listPeople.filter(function(e){
                console.log('person in list people', e);
                return this.indexOf(e.id) >= 0;
              }, listPeopleID);
              console.log('list people filter in', this.listPeople);
            // this._people = people;
            // this.people = ;
        }
    }

  }
