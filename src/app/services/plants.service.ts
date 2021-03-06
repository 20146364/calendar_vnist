import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  constructor() { }

  getListPlants() {
    let listPlants = null;
    let myItem: any;
    let key;
    key = 'localPlant';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listPlants = JSON.parse(myItem);
    }
    return listPlants;
  }
}
