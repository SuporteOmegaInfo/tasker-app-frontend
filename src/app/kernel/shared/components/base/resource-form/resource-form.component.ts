import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainService } from '../../../../core/services/main.service';
import { IBaseEntity } from '../../../interfaces/base-entity';
import { IBreadcrumb } from '../../../interfaces/ui/breadcrumb';
import { BaseResourceService } from '../../../services/base-resource.service';
import { BaseFormComponent } from '../base-form/base-form.component';

@Component({
  template: '',
})
export abstract class ResourceFormComponent<T extends IBaseEntity> extends BaseFormComponent implements OnInit {

  breadcrumbs: IBreadcrumb[] = [
    {path: '/home', icon: 'home', label: 'Home'},
    {path: `/${this.service.entityOptions.entityData.route}`, icon: this.service.entityOptions.entityData.icon, label: this.service.entityOptions.entityData.pluralName},
  ]
  form: FormGroup;
  resource: T;

  sub: Subscription[] = []
  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  currentAction: string;
  pageTitle: string;

  /**
   *
   */
  constructor(
    protected service: BaseResourceService<T>,
    protected injector: Injector,
    protected mainServ: MainService,
  ) {
    super(injector, mainServ)
    this.mainServ.toggleLoading(true)
    this.setCurrentAction();
    this.setPageTitle();
  }

  ngOnInit() {}

  public submit(){

    this.mainServ.toggleLoading(true)
    this.mainServ.toggleSubmitting(true)

    let data = this.bindFormDataToSubmit()

    //debugger

    if(this.currentAction == 'new'){
      this.service.create(data).subscribe(
        result => {
          this.mainServ.sendToastr('success', `${this.service.entityOptions.entityData.singularName} registrad${this.service.entityOptions.entityData.singularArticle} com sucesso!`)
          this.router.navigate([this.service.entityOptions.entityData.route])
          this.mainServ.toggleLoading(false)
          this.mainServ.toggleSubmitting(false)
        },
        error => {
          this.mainServ.sendDefaultErrorToastr(error)
          this.mainServ.toggleLoading(false)
          this.mainServ.toggleSubmitting(false)
        }
      )
    }
    if(this.currentAction == 'edit'){
      this.service.update(data).subscribe(
        result => {
          // this.router.navigate([this.service.entityOptions.entityData.route], { skipLocationChange: true });
          // if (result.data.slug) {
          //   this.router.navigate([this.service.entityOptions.entityData.route, result.data.slug, 'edit'], { skipLocationChange: true });
          // } else {
          //   this.router.navigate([this.service.entityOptions.entityData.route, result.data.id, 'edit'], { skipLocationChange: true });
          // }

          this.mainServ.toggleLoading(false)
          this.mainServ.toggleSubmitting(false)
          this.mainServ.sendToastr('success', `${this.service.entityOptions.entityData.singularName} ${data.name} atualizad${this.service.entityOptions.entityData.singularArticle} com sucesso!`)

          const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

          this.router
          .navigateByUrl(baseComponentPath, { skipLocationChange: true })
          .then(() => {
            if (result.data.slug) {
              this.router.navigate([baseComponentPath, result.data.slug, 'edit']);
            } else {
              this.router.navigate([baseComponentPath, result.data.id, 'edit']);
            }
          });


        },
        error => {
          this.mainServ.toggleLoading(false)
          this.mainServ.toggleSubmitting(false)
          this.mainServ.sendDefaultErrorToastr(error)
        }
      )
    }

  }

  protected setCurrentAction() {

    if (this.route.snapshot.url[0].path == 'new') {
      this.currentAction = 'new';

      this.breadcrumbs.push({
        path : `/${this.service.entityOptions.entityData.route}/new`,
        icon: 'add_circle',
        label: `Nov${this.service.entityOptions.entityData.singularArticle} ${this.service.entityOptions.entityData.singularName}`
      })

      this.mainServ.toggleLoading(false)
    } else {
      if (this.route.snapshot.url[1].path == 'edit') {
        let id_or_slug = this.route.snapshot.url[0].path

        this.loadEntity(id_or_slug)
        this.currentAction = 'edit';
      }
    }
  }

  protected loadEntity(id_or_slug: string | number){
    this.service.getById(id_or_slug).subscribe(
      result => {
        this.resource = result.data
        this.breadcrumbs.push(
          {path: `/${this.service.entityOptions.entityData.route}/${this.resource.slug}/edit`, icon: 'edit_note', label: this.resource.name}
        )

        this.bindFormData(this.resource)

        this.mainServ.toggleLoading(false)
      },
      error => {
        this.mainServ.sendDefaultErrorToastr(error)

        this.mainServ.toggleLoading(false)
      }
    )

  }
  //Formata o Endereço a partir da formatação vinda do VIACEP
  patchAddress(data: any) {
    this.form.patchValue({
      address: {
        city: data.localidade,
        street: data.logradouro,
        district: data.bairro,
        uf: data.uf,
      },
    });
  }
  //Formata o Endereço na formatação da aplicação
  patchSystemAddress(data: any) {
    this.form.patchValue({
      address: data,
    });
  }

  protected setPageTitle() {
    if (this.currentAction == 'new') {
      //BASE 9
      this.pageTitle = this.creationPageTitle();
    } else {
      if (this.currentAction == 'edit') {
        //BASE 10
        this.pageTitle = this.editionPageTitle();
      }
    }
  }

  protected creationPageTitle(): string {
    return `Cadastro de nov${this.service.entityOptions.entityData.singularArticle} ${this.service.entityOptions.entityData.singularName}`;
  }

  protected editionPageTitle(): string {
    return `Editando ${this.service.entityOptions.entityData.singularName}`;
  }

  protected abstract bindFormData(resource: T): void;
  protected abstract bindFormDataToSubmit();
  protected abstract jsonDataToResourceFn;

}
