import { Component, Injector } from '@angular/core';
import { IPosition } from '../../../../kernel/shared/entities/position';
import { BaseListComponent } from '../../../../kernel/shared/components/base/base-list/base-list.component';
import { MainService } from '../../../../kernel/core/services/main.service';
import { PositionService } from '../shared/position.service';
import { IBreadcrumb } from '../../../../kernel/shared/interfaces/ui/breadcrumb';
import { ITableOptions } from '../../../../kernel/shared/interfaces/ui/table';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrl: './position-list.component.scss'
})
export class PositionListComponent extends BaseListComponent<IPosition>{

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/positions', icon: 'rule', label: 'Perfis'},
  ]

  tableOptions: ITableOptions
  tableData: IPosition[]

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: PositionService,
    protected mainServ: MainService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(injector, service, mainServ);
    this.tableOptions = service.entityOptions
  }
}
