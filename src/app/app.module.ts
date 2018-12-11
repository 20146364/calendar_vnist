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

import { AccordionModule } from 'primeng/components/accordion/accordion';
import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import {ListboxModule} from 'primeng/components/listbox/listbox';
import {AutoCompleteModule} from 'primeng/components/autocomplete/autocomplete';
import {ScrollPanelModule} from 'primeng/components/scrollpanel/scrollpanel';
import {DropdownModule} from 'primeng/components/dropdown/dropdown';

import { AuthenticationService } from './services/authentication.service';
import { CalendarService } from './services/calendar.service';
// import { TicketsService } from './services/tickets.service';
import { PlantService } from './services/plant.service';
import { CategoryService } from './services/category.service';
import { PeopleService } from './services/people.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventDetailComponent,
    MytodoComponent,
    NewtodoComponent,
    ComplianceComponent,
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
    AutoCompleteModule,
    ScrollPanelModule,
    DropdownModule,
    AppRoutingModule
  ],
  providers: [AuthenticationService, CalendarService, PlantService, CategoryService, PeopleService],
  bootstrap: [AppComponent]
})
export class AppModule { }
