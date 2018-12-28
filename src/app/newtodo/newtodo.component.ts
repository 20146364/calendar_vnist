import { Component, OnInit } from '@angular/core';

interface Time {
  name: string;
}

@Component({
  selector: 'app-newtodo',
  templateUrl: './newtodo.component.html',
  styleUrls: ['./newtodo.component.scss']
})



export class NewtodoComponent implements OnInit {

  title = 'New todo';
  val = 1;
  time: Time[];
  selectedTime: Time;

  constructor() {
    this.time = [
      {name: 'week'},
      {name: 'month'},
      {name: 'year'}
    ];
  }

  ngOnInit() {
  }

}
