import { NgModule } from '@angular/core';

import { ProjectsRoutingModule } from './projects-routing.module';
import { SharedModule } from '../../../kernel/shared/shared.module';
import { ProjectComponent } from './project/project.component';


@NgModule({
  declarations: [
    ProjectComponent
  ],
  imports: [
    SharedModule,
    ProjectsRoutingModule
  ]
})
export class ProjectsModule { }
