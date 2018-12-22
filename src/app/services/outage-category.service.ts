import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OutageCategoryService {

  constructor() { }

  getListOutageCategory() {
    let listOutageCategory = null;
    let myItem: any;
    let key;
    key = 'localOutageCategory';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listOutageCategory = JSON.parse(myItem);
    }
    return listOutageCategory;
  }
}
