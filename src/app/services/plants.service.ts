import { Injectable } from '@angular/core';
import { Config } from '../services/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

  constructor(private http: HttpClient) { }

  getListPlants() {
    let listPlants = null;
    let myItem: any;
    let key;
    key = 'locPlant';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listPlants = JSON.parse(myItem);
    }
    return listPlants;
  }

  getPlants(id) {
    return this.http.get(`${Config.api_endpoint}plants/fetch?ids=${id}`, httpOptions);
  }
}
