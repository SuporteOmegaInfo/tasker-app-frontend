import { Component, Injector } from '@angular/core';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { BaseListComponent } from '../../../../kernel/shared/components/base/base-list/base-list.component';
import { MainService } from '../../../../kernel/core/services/main.service';
import { CompanyService } from '../shared/company.service';
import { IBreadcrumb } from '../../../../kernel/shared/interfaces/ui/breadcrumb';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.scss'
})
export class CompanyListComponent extends BaseListComponent<ICompany>{

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: '/companies', icon: 'store', label: 'Unidades'},
  ]

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: CompanyService,
    protected mainServ: MainService,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    super(injector, service, mainServ);
    this.tableOptions = service.entityOptions
  }
}
