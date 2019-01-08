import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicecallOutageService {

  constructor() { }

  getListServiceCallOutage() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'localSCOT';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEvents() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'localListEvents';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }

  getListServiceCallOutagePrev() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'localSCOTPrev';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEventsPrev() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'localListEventsPrev';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }

  getListServiceCallOutageNext() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'localSCOTNext';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEventsNext() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'localListEventsNext';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }
}
