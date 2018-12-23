import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicecallOutageService {

  constructor() { }

  getListServiceCallOutage(listEvents, listSCOT) {
    let mySCOT: any;
    let myEvents: any;
    let keySCOT = 'localServiceCallOutage';
    let keyListEvents = 'localListEvents';
    mySCOT = sessionStorage.getItem(keySCOT);
    myEvents = sessionStorage.getItem(keyListEvents);
    if (mySCOT !== 'undefined' && mySCOT !== null
    && myEvents !== 'undefined' && myEvents !== null) {
      listSCOT = JSON.parse(mySCOT);
      listEvents = JSON.parse(listEvents);
    }
  }
}
