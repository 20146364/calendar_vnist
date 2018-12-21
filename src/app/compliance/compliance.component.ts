import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compliance',
  templateUrl: './compliance.component.html',
  styleUrls: ['./compliance.component.scss']
})
export class ComplianceComponent implements OnInit {

  title = 'Compliance View';

  elements: any[];

  months: any[];

  constructor() { }

  ngOnInit() {

    this.months = [
      // { field: 'element', header: '' },
      { field: 'jan', header: 'Jan' },
      { field: 'feb', header: 'Feb' },
      { field: 'mar', header: 'Mar' },
      { field: 'apr', header: 'Apr' },
      { field: 'may', header: 'May' },
      { field: 'june', header: 'June' },
      { field: 'july', header: 'July' },
      { field: 'aug', header: 'Aug' },
      { field: 'sep', header: 'Sep' },
      { field: 'oct', header: 'Oct' },
      { field: 'nov', header: 'Nov' },
      { field: 'dec', header: 'Dec' }
    ];

    this.elements = [
      {
        // element: 'element 1',
        jan: ['todo1', 'todo 2'],
        feb: 'Ot2',
        mar: 'Ot1',
        apr: 'Ot5',
        may: ['todo1', 'todo 67', 'todo 12'],
        june: 'Ot2',
        july: 'Ot1',
        aug: 'todo1',
        sep: 'Ot1',
        oct: 'Ot1',
        nov: ['todo1', 'todo 2', 'todo 2', 'todo 2'],
        dec: 'Ot1'
      },
      // {element: 'element 2', june: 'todo2', mar: 'Ot4', nov: '5'},
      // {element: 'element 3', sep: 'todo4', may: 'Ot2', oct: '5'},
      // {element: 'element 4', feb: 'todo12', july: 'Ot8'},
      // {element: 'element 5', dec: 'todo10', oct: 'Ot5', aug: '5'},
      {june: 'todo2', mar: 'Ot4', nov: '5'},
      {sep: 'todo4', may: 'Ot2', oct: '5'},
      {feb: 'todo12', july: 'Ot8'},
      {dec: 'todo10', oct: 'Ot5', aug: '5'},
    ];

  }

}
