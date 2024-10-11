import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionFormComponent } from './position-form/position-form.component';
import { PositionListComponent } from './position-list/position-list.component';

const routes: Routes = [
  { path: '', component: PositionListComponent },
  { path: 'new', component: PositionFormComponent },
  { path: ':slug/edit', component: PositionFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PositionsRoutingModule { }
