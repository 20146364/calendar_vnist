import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Config } from './config';
import * as url from 'url';
import * as moment from 'moment';
import { AuthenticationService } from './authentication.service';

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

  // Plants list
  listPlants: any[];

  constructor(private auth: AuthenticationService,
              private http: HttpClient) { }

  getListPlantData = (request_method, payload = '\n') => {
    // Normalize request contents
    let endpoint_url;
    endpoint_url = url.parse(Config.api_endpoint);
    let host;
    host = endpoint_url.host;
    let path;
    path = endpoint_url.path;
    let used_headers;
    used_headers = `Accept: 'application/json'\n
                       'Content-Type': 'application/json'\n`;
    let date_raw;
    date_raw = new Date();
    let date;
    // Internally .format('YYYY-MM-DDTHH:mm:ssZ') is used, though Javascript's ISO-String is also supported
    date = moment(date_raw).utc().toISOString();

    let normalized_content;
    normalized_content = `${request_method} ${path}
      Host: ${host}
      ${used_headers}=====
      ${payload}`;

    let signature;
    signature = this.auth.generateSignature(Config.user_id, Config.app_secret, host, date, normalized_content);

    let headers;
    headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.auth.encodeEncryptionKey('Padcon-Agent-Signature-v2', Config.user_id, date, signature));

    return this.http.get(Config.api_endpoint, {
      headers: headers
    });
  }

  async initPlantsList() {
    let plantslist;
    plantslist = [];
    plantslist = await fetch(Config.api_endpoint + 'plants/fetch', {
    'credentials': 'include',
    'headers': {
      'accept': 'application/json',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8,ja;q=0.7',
      'x-requested-with': 'XMLHttpRequest'
    },
    'referrer': Config.api_endpoint + 'angular-calendar/',
    'referrerPolicy': 'no-referrer-when-downgrade',
    'body': null,
    'method': 'GET',
    'mode': 'cors'
    }).then(function(response) {
      return response.json();
    });
    this.listPlants = plantslist.data;
    console.log('this is plants list');
    console.log(this.listPlants);
  }
}
