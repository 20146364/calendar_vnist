import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { MytodoComponent } from './mytodo/mytodo.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { NewtodoComponent } from './newtodo/newtodo.component';
import { ComplianceComponent } from './compliance/compliance.component';

import { ScheduleModule } from 'primeng/primeng';
import { DialogModule } from 'primeng/primeng';
import { InputTextModule } from 'primeng/primeng';
import { CalendarModule } from 'primeng/primeng';
import { CheckboxModule } from 'primeng/primeng';
import { ButtonModule } from 'primeng/primeng';
import { TabViewModule } from 'primeng/primeng';
import { CodeHighlighterModule } from 'primeng/primeng';
import { InplaceModule } from 'primeng/primeng';
import { NgSelect2Module } from 'ng-select2';

import { AccordionModule } from 'primeng/components/accordion/accordion';
import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import {ListboxModule} from 'primeng/components/listbox/listbox';
import {ScrollPanelModule} from 'primeng/components/scrollpanel/scrollpanel';
import {SelectButtonModule} from 'primeng/components/selectbutton/selectbutton';
import {RadioButtonModule} from 'primeng/components/radiobutton/radiobutton';
import {TableModule} from 'primeng/components/table/table';

import { AuthenticationService } from './services/authentication.service';
import { CalendarService } from './services/calendar.service';
import { PlantsService } from './services/plants.service';
import { ParticipatingPeopleService } from './services/participating-people.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventDetailComponent,
    MytodoComponent,
    NewtodoComponent,
    ComplianceComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ScheduleModule,
    DialogModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    TabViewModule,
    CodeHighlighterModule,
    InplaceModule,
    ToolbarModule,
    SplitButtonModule,
    AccordionModule,
    ListboxModule,
    ScrollPanelModule,
    SelectButtonModule,
    RadioButtonModule,
    TableModule,
    NgSelect2Module,
    AppRoutingModule
  ],
  providers: [AuthenticationService, CalendarService, PlantsService, ParticipatingPeopleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
