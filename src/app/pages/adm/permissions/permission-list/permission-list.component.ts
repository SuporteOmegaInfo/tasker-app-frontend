import { Component, Injector } from '@angular/core';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { BaseListComponent } from '../../../../kernel/shared/components/base/base-list/base-list.component';
import { MainService } from '../../../../kernel/core/services/main.service';
import { PermissionService } from '../shared/permission.service';
import { IBreadcrumb } from '../../../../kernel/shared/interfaces/ui/breadcrumb';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-permission-list',
  templateUrl: './permission-list.component.html',
  styleUrl: './permission-list.component.scss'
})
export class PermissionListComponent extends BaseListComponent<IPermission>{

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/permissions', icon: 'privacy_tip', label: 'Permissões'},
  ]

  tableOptions: ITableOptions
  tableData: IPermission[]

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: PermissionService,
    protected mainServ: MainService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(injector, service, mainServ);
    this.tableOptions = service.entityOptions
  }
}
