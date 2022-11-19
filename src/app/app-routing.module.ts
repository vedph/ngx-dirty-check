import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DirtyCheckGuard } from 'projects/myrmidon/ngx-dirty-check/src/public-api';

import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'settings',
    component: SettingsComponent,
    canDeactivate: [DirtyCheckGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
