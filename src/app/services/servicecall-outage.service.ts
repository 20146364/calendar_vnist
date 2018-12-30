import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicecallOutageService {

  constructor() { }

  getListServiceCallOutage() {
    let listSCOT = null;
    let mySCOT: any;
    let keySCOT = 'localServiceCallOutage';
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
}
