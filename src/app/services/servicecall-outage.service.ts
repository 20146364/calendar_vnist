import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicecallOutageService {

  constructor() { }

  getListServiceCallOutage() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'locSCOT';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEvents() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'locListEvents';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }

  getListServiceCallOutagePrev() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'locSCOTPrev';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEventsPrev() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'locListEventsPrev';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }

  getListServiceCallOutageNext() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'locSCOTNext';
    mySCOT = sessionStorage.getItem(keySCOT);
    if (mySCOT !== 'undefined' && mySCOT !== null) {
      listSCOT = JSON.parse(mySCOT);
    }
    return listSCOT;
  }

  getListEventsNext() {
    let listEvents = null;
    let myEvents: any;
    let keyListEvents = 'locListEventsNext';
    myEvents = sessionStorage.getItem(keyListEvents);
    if (myEvents !== 'undefined' && myEvents !== null) {
      listEvents = JSON.parse(myEvents);
    }
    return listEvents;
  }
}
