import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ParticipatingPeopleService {

  constructor() { }

  getListParticipatingPeople() {
    let listParticipatingPeople = null;
    let myItem: any;
    let key;
    key = 'localParticipatingPeople';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listParticipatingPeople = JSON.parse(myItem);
    }
    return listParticipatingPeople;
  }
}
