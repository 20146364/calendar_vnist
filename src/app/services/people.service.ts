import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PeopleService {

  constructor(private http: HttpClient) { }

  getPeople() {
    return this.http.get<any>('assets/people.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data =>  data);
    }
}
