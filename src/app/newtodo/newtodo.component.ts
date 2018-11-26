import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-newtodo',
  templateUrl: './newtodo.component.html',
  styleUrls: ['./newtodo.component.scss']
})
export class NewtodoComponent implements OnInit {

  title: string = "New todo";

  constructor() { }

  ngOnInit() {
  }

}
