import { NgModule } from '@angular/core';

import { ProjectStepsRoutingModule } from './project-steps-routing.module';
import { SharedModule } from '../../../kernel/shared/shared.module';


@NgModule({
  declarations: [],
  imports: [
    SharedModule,
    ProjectStepsRoutingModule
  ]
})
export class ProjectStepsModule { }
