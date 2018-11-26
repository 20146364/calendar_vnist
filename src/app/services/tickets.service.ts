import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { TreeNode } from 'primeng/components/common/api';
@Injectable()
export class TicketsService {

  constructor(private http: HttpClient) { }

  getMyCalendarTickets() {
    return this.http.get<any>('assets/tickets/mycalendars.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
    }

  getPlantCalendarTickets() {
    return this.http.get<any>('assets/tickets/plantcalendars.json')
      .toPromise()
      .then(res => <TreeNode[]>res.data);
    }
}
