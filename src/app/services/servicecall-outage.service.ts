import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicecallOutageService {

  constructor() { }

  getListServiceCallOutage() {
    let listSCOT = null;
    let myItem: any;
    let key;
    key = 'localServiceCallOutage';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCOT = JSON.parse(myItem);
    }
    return listSCOT;
  }
}
