import { Component, OnInit  } from '@angular/core';
import { CalendarService } from '../services/calendar.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {

  selectedEvent: any;
  event: any;

  constructor(private calendarSrv: CalendarService, private router: Router) { }

  ngOnInit() {
    this.selectedEvent = this.calendarSrv.getSelectedEvent();
    if (this.calendarSrv.getSelectedEvent() === 0) {
      this.router.navigate(['/']);
    } else {
      console.log(this.selectedEvent);
      this.event = new MyEvent();
      this.event.title = this.selectedEvent.calEvent.title;
      this.event.allDay = this.selectedEvent.calEvent.allDay;
      if(this.selectedEvent.calEvent.end) {
        this.event.end = this.selectedEvent.calEvent.end.toDate();
      }
      if(this.selectedEvent.calEvent.start) {
        this.event.start = this.selectedEvent.calEvent.start.toDate();
      }
    }
  }
  goBack() {
    this.router.navigate(['/']);
  }

}

export class MyEvent {
  id: number;
  title: string;
  start: string;
  end: any;
  allDay = true;
  color: string;
  className: string;
}
