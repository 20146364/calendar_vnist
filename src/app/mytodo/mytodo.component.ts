import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-mytodo',
  templateUrl: './mytodo.component.html',
  styleUrls: [
    './mytodo.component.scss',
  ],
  encapsulation: ViewEncapsulation.None,
})
export class MytodoComponent implements OnInit {

  title: string = "My list todo";

  categoriesSortBy: any[];

  //Sort by
  sortBy:any[];
  selectedSortBy:any[];

  tickets: any[];

  constructor() { }

  ngOnInit() {

    this.tickets = [{
      name: "SC 1",
      type: "SC",
      displaycontent: "display of ticket 1",
      editcontent: "edit of ticket 1",
      startcontent: "start of ticket 1"
    },
    {
      name: "Sc 2",
      type: "SC",
      displaycontent: "display of ticket 2",
      editcontent: "edit of ticket 2",
      startcontent: "start of ticket 2"
    },
    {
      name: "SC 3",
      type: "SC",
      displaycontent: "display of ticket 3",
      editcontent: "edit of ticket 3",
      startcontent: "start of ticket 3"
    },
    {
      name: "OT 4",
      type: "OT",
      displaycontent: "display of ticket 4",
      editcontent: "edit of ticket 4",
      startcontent: "start of ticket 4"
    },
    {
      name: "OT 5",
      type: "OT",
      displaycontent: "display of ticket 5",
      editcontent: "edit of ticket 5",
      startcontent: "start of ticket 5"
    }];

    this.sortBy = [
      {
        id: "dd",
        val: "Due Date",
        label: "Due Date"
      },
      {
        id: "pl",
        val: "Plant",
        label: "Plant"
      },
      {
        id: "colcb",
        val: "Creator or last changed by",
        label: "Creator or last changed by"
      }
    ]

  }

}
