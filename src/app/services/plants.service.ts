import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import * as url from 'url';
import * as moment from 'moment';
import { AuthenticationService } from './authentication.service';
import { Observable } from 'rxjs';
import { IPlant } from '../models/plant';

const httpOptions = {
  headers: new HttpHeaders({
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ja;q=0.7',
    'x-requested-with': 'XMLHttpRequest'
  })
};
@Injectable({
  providedIn: 'root'
})
export class PlantsService {

  listPlants: any[];
  private _url = '../../assets/data/plants.json';
  constructor(private http: HttpClient) { }

  // getListPlants(): Observable<any[]> {
  //   this.http.get(Config.api_endpoint + 'plants/fetch', httpOptions).subscribe(data => {
  //     this.listPlants = [];
  //     this.listPlants = data['data'];
  //   });
  //   return of(this.listPlants);
  // }
  getListPlants(): Observable<IPlant[]> {
    return this.http.get<IPlant[]>(this._url);
  }
}
