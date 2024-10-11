import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { MainService } from '../../../../core/services/main.service';
import { IBaseEntity } from '../../../interfaces/base-entity';
import { IBaseOutListRequest } from '../../../interfaces/base-request';
import { BaseResourceService } from '../../../services/base-resource.service';
import { IPagination } from '../../../interfaces/entity';
import { IDepartment } from '../../../entities/department';
import { ITableOptions } from '../../../interfaces/ui/table';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  template: '',
})
export class BaseListComponent<T extends IBaseEntity> implements OnInit, OnDestroy {

  resources: IBaseOutListRequest = null;
  loading: boolean = false;
  sub: Subscription[] = [];
  pagination: IPagination

  tableOptions: ITableOptions
  tableData: IDepartment[]

  constructor(
    protected injector: Injector,
    private baseServ: BaseResourceService<T>,
    protected mainServ?: MainService,
    protected router?: Router,
    protected route?: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.initialize();
  }

  protected initialize(filters?: any){
    this.mainServ.toggleLoading(true)
    if(filters){
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: filters,
        queryParamsHandling: 'merge',
      })
    }

    this.sub.push(
      this.baseServ.getAll(filters ? filters : null).subscribe(
        (response) => {
          this.mainServ.toggleLoading(false);
          this.resources = response;
        },
        (error) => {
          this.mainServ.toggleLoading(false);
          this.mainServ.sendDefaultErrorToastr(error)
        }
      )
    );
  }

  paginate(event){
    this.initialize(event)
  }

  protected deleteResource(resource: T) {
    this.mainServ.toggleLoading(true);

    this.sub.push(
      this.baseServ.delete(resource.id).subscribe(
        () => {
          (this.resources.data = this.resources.data.filter(
            (element) => element != resource
          )),
            this.mainServ.sendToastr('success', 'Item deletado com sucesso!')
            this.mainServ.toggleLoading(false);
        },
        (error) => {
          this.mainServ.sendDefaultErrorToastr(error)
          this.mainServ.toggleLoading(false);
        }
      )
    );
  }

  hasPermissions(permissions: string[]){
    return this.mainServ.hasPermissions(permissions)
  }

  cssButtonAddResource(){
    return {
      'col-md-3': this.hasPermissions(this.tableOptions.tableRuler.create),
      'hidden': !this.hasPermissions(this.tableOptions.tableRuler.create),
    }
  }

  cssPaginator(){
    return {
      'col-md-9': this.hasPermissions(this.tableOptions.tableRuler.create),
      'col-12': !this.hasPermissions(this.tableOptions.tableRuler.create),
    }
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
