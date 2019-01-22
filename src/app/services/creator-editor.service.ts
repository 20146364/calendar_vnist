import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CreatorEditorService {

  constructor() { }

  getListCreatorEditor() {
    let listCreatorEditor = null;
    let myItem: any;
    let key;
    key = 'locCreatorEditor';
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listCreatorEditor = JSON.parse(myItem);
    }
    return listCreatorEditor;
  }
}
