import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { AuthenticationService } from "./authentication.service";
import { Config } from './config';
import * as moment from 'moment';
import * as url from 'url';


@Injectable()
export class CalendarService {

  data = 0;
  constructor(private auth: AuthenticationService, private http: Http) { }

  getExampleData = (request_method, payload="\n") => {
    // Normalize request contents
    let endpoint_url = url.parse(Config.api_endpoint);
    let host = endpoint_url.host;
    let path = endpoint_url.path;
    let used_headers = `Accept: 'application/json'\n
                       'Content-Type': 'application/json'\n`;

    let date_raw = new Date();
    let date = moment(date_raw).utc().toISOString(); // Internally .format('YYYY-MM-DDTHH:mm:ssZ') is used, though Javascript's ISO-String is also supported

    let normalized_content = `${request_method} ${path}
      Host: ${host}
      ${used_headers}=====
      ${payload}`;

    let signature = this.auth.generateSignature(Config.user_id, Config.app_secret, host, date, normalized_content);

    let headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', this.auth.encodeEncryptionKey('Padcon-Agent-Signature-v2', Config.user_id, date, signature));

    return this.http.get(Config.api_endpoint, {
      headers: headers
    });
  }

  setSelectedEvent = (data) => {
    this.data = data;
  }

  getSelectedEvent = () => this.data;
}
