import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceCallService {

  constructor() { }

  getListSCs() {
    let listSCs = null;
    let myItem: any;
    let key;
    key = 'locSCs';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCs = JSON.parse(myItem);
    }
    return listSCs;
  }
}
