import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { EventDetailComponent } from './event-detail/event-detail.component';
import { MytodoComponent } from './mytodo/mytodo.component';
import { ComplianceComponent } from './compliance/compliance.component';
import { NewtodoComponent } from './newtodo/newtodo.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'detail/:id', component: EventDetailComponent },
  { path: 'mytodo', component: MytodoComponent },
  { path: 'compliance', component: ComplianceComponent },
  { path: 'newtodo', component: NewtodoComponent },
];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
