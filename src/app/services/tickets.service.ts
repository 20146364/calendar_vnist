import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TicketsService {

  constructor() { }

  getListTickets() {
    let listTickets = null;
    let myItem: any;
    let key;
    key = 'localTicket';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listTickets = JSON.parse(myItem);
    }
    return listTickets;
  }
}
