import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategories() {
    return this.http.get<any>('assets/categories.json')
      .toPromise()
      .then(res => <any[]>res.data)
      .then(data => { return data; });
    }
}

