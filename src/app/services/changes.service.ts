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
export class ChangesService {

  constructor(private http: HttpClient) { }
}
