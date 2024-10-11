import { NgModule } from '@angular/core';

import { PositionsRoutingModule } from './positions-routing.module';
import { SharedModule } from '../../../kernel/shared/shared.module';
import { PositionListComponent } from './position-list/position-list.component';
import { PositionFormComponent } from './position-form/position-form.component';


@NgModule({
  declarations: [
    PositionListComponent,
    PositionFormComponent
  ],
  imports: [
    SharedModule,
    PositionsRoutingModule
  ]
})
export class PositionsModule { }
