import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class PlantService {

  constructor(private http: HttpClient) { }

  getPlants() {
    return this.http.get<any>('assets/plants.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
    }
}