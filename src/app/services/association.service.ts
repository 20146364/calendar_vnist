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
export class AssociationService {

  constructor(private http: HttpClient) { }

  getListPlants(key) {
    let listPlants = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listPlants = JSON.parse(myItem);
    }
    return listPlants;
  }

  setListPlants(listPlants, key) {
    sessionStorage.setItem(key, JSON.stringify(listPlants));
  }

  getPlants(id) {
    return this.http.get(`${Config.api_endpoint}plants/fetch?ids=${id}`, httpOptions);
  }

  getListDeviceplaceholders(key) {
    let listDeviceplaceholders = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listDeviceplaceholders = JSON.parse(myItem);
    }
    return listDeviceplaceholders;
  }

  setListDeviceplaceholders(listDeviceplaceholders, key) {
    sessionStorage.setItem(key, JSON.stringify(listDeviceplaceholders));
  }

  getDeviceplaceholders(id) {
    return this.http.get(`${Config.api_endpoint}deviceplaceholders/fetch?ids=${id}`, httpOptions);
  }
  
  getListTickets(key) {
    let listTickets = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listTickets = JSON.parse(myItem);
    }
    return listTickets;
  }

  setListTickets(listTickets, key) {
    sessionStorage.setItem(key, JSON.stringify(listTickets));
  }

  getTickets(id) {
    return this.http.get(`${Config.api_endpoint}tstickets/fetch?ids=${id}`, httpOptions);
  }

  getListActionrequests(key) {
    let listActionrequests = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listActionrequests = JSON.parse(myItem);
    }
    return listActionrequests;
  }

  setListActionrequests(listActionrequests, key) {
    sessionStorage.setItem(key, JSON.stringify(listActionrequests));
  }

  getActionrequests(id) {
    return this.http.get(`${Config.api_endpoint}tsactionrequests/fetch?ids=${id}`, httpOptions);
  }

  getListSCCreators(key) {
    let listSCCreators = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCCreators = JSON.parse(myItem);
    }
    return listSCCreators;
  }

  getSCCreators(id) {
    return this.http.get(`${Config.api_endpoint}people/fetch?ids=${id}`, httpOptions);
  }

  getListSCModifiers(key) {
    let listSCModifiers = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCModifiers = JSON.parse(myItem);
    }
    return listSCModifiers;
  }

  getSCModifiers(id) {
    return this.http.get(`${Config.api_endpoint}people/fetch?ids=${id}`, httpOptions);
  }

  getListSCTeams(key) {
    let listSCTeams = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCTeams = JSON.parse(myItem);
    }
    return listSCTeams;
  }

  setListSCTeams(listSCTeams, key) {
    sessionStorage.setItem(key, JSON.stringify(listSCTeams));
  }

  getSCTeams(id) {
    return this.http.get(`${Config.api_endpoint}teams/fetch?ids=${id}`, httpOptions);
  }

  getListSCTasks(key) {
    let listSCTasks = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCTasks = JSON.parse(myItem);
    }
    return listSCTasks;
  }

  setListSCTasks(listSCTasks, key) {
    sessionStorage.setItem(key, JSON.stringify(listSCTasks));
  }

  getSCTasks(id) {
    return this.http.get(`${Config.api_endpoint}tstasks/fetch?ids=${id}`, httpOptions);
  }

  getListSCPeople(key) {
    let listSCPeople = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listSCPeople = JSON.parse(myItem);
    }
    return listSCPeople;
  }

  setListSCPeople(listSCPeople, key) {
    sessionStorage.setItem(key, JSON.stringify(listSCPeople));
  }

  getSCPeople(id) {
    return this.http.get(`${Config.api_endpoint}people/fetch?ids=${id}`, httpOptions);
  }

  getListOTCategories(key) {
    let listOTCategories = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listOTCategories = JSON.parse(myItem);
    }
    return listOTCategories;
  }

  setListOTCategories(listOTCategories, key) {
    sessionStorage.setItem(key, JSON.stringify(listOTCategories));
  }

  // ---> sua thanh outagecategory
  getOTCategories(id) {
    return this.http.get(`${Config.api_endpoint}tsoutages/fetch?ids=${id}`, httpOptions);
  }

  getListOTCreators(key) {
    let listOTCreators = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listOTCreators = JSON.parse(myItem);
    }
    return listOTCreators;
  }

  getOTCreators(id) {
    return this.http.get(`${Config.api_endpoint}people/fetch?ids=${id}`, httpOptions);
  }

  getListOTModifiers(key) {
    let listOTModifiers = null;
    let myItem: any;
    myItem = sessionStorage.getItem(key);
    if (myItem !== 'undefined' && myItem !== null) {
      listOTModifiers = JSON.parse(myItem);
    }
    return listOTModifiers;
  }

  getOTModifiers(id) {
    return this.http.get(`${Config.api_endpoint}people/fetch?ids=${id}`, httpOptions);
  }
}
