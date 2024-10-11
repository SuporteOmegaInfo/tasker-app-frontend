import { Component, Injector } from '@angular/core';
import { IDepartment } from '../../../../kernel/shared/entities/department';
import { BaseListComponent } from '../../../../kernel/shared/components/base/base-list/base-list.component';
import { MainService } from '../../../../kernel/core/services/main.service';
import { DepartmentService } from '../shared/department.service';
import { IBreadcrumb } from '../../../../kernel/shared/interfaces/ui/breadcrumb';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-department-list',
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent extends BaseListComponent<IDepartment>{

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/departments', icon: 'rule', label: 'Departamentos'},
  ]

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: DepartmentService,
    protected mainServ: MainService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(injector, service, mainServ);
    this.tableOptions = service.entityOptions
  }
}
