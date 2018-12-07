import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DuedateService {

  constructor(private http: HttpClient) { }

  getDueDates() {
    return this.http.get<any>('assets/categories.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => data );
    }
}
