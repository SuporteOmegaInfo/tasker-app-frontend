import { NgModule } from '@angular/core';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { SharedModule } from '../../../kernel/shared/shared.module';
import { DepartmentListComponent } from './department-list/department-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';


@NgModule({
  declarations: [
    DepartmentListComponent,
    DepartmentFormComponent
  ],
  imports: [
    SharedModule,
    DepartmentsRoutingModule
  ]
})
export class DepartmentsModule { }
