import { Component, Injector } from '@angular/core';
import { IUser } from '../../../../kernel/shared/entities/user';
import { BaseListComponent } from '../../../../kernel/shared/components/base/base-list/base-list.component';
import { MainService } from '../../../../kernel/core/services/main.service';
import { UserService } from '../shared/user.service';
import { IBreadcrumb } from '../../../../kernel/shared/interfaces/ui/breadcrumb';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent extends BaseListComponent<IUser>{

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/users', icon: 'manage_accounts', label: 'Usuários'},
  ]

  tableOptions: ITableOptions
  tableData: IUser[]

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: UserService,
    protected mainServ: MainService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(injector, service, mainServ, router, route)
    this.tableOptions = service.entityOptions
  }
}
