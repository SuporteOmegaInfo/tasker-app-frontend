import { NgModule } from '@angular/core';

import { PermissionsRoutingModule } from './permissions-routing.module';
import { SharedModule } from '../../../kernel/shared/shared.module';
import { PermissionListComponent } from './permission-list/permission-list.component';
import { PermissionFormComponent } from './permission-form/permission-form.component';


@NgModule({
  declarations: [
    PermissionListComponent,
    PermissionFormComponent
  ],
  imports: [
    SharedModule,
    PermissionsRoutingModule
  ]
})
export class PermissionsModule { }
