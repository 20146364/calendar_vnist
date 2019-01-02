import {Component, OnInit} from '@angular/core';

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
  date: Date;
  en: any;
  val2 =  'Never';


  constructor() {
    this.time = [
      {name: 'week'},
      {name: 'month'},
      {name: 'year'}
    ];
  }

  ngOnInit() {
    this.en = {
      firstDayOfWeek: 0,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      today: 'Today',
      clear: 'Clear'
    };
  }

}
