import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CreatorchangedService {

  constructor(private http: HttpClient) { }

  getCreatorChangeds() {
    return this.http.get<any>('assets/categories.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => data );
    }
}
