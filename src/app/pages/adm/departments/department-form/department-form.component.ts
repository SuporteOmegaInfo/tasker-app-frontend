import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { MainService } from '../../../../kernel/core/services/main.service';
import { ResourceFormComponent } from '../../../../kernel/shared/components/base/resource-form/resource-form.component';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { IDepartment } from '../../../../kernel/shared/entities/department';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { ICheckbox } from '../../../../kernel/shared/interfaces/ui/checkbox';
import { ISelectItem } from '../../../../kernel/shared/interfaces/ui/select';
import { HelperService } from '../../../../kernel/shared/services/helper.service';
import { CompanyService } from '../../companies/shared/company.service';
import { PermissionService } from '../../permissions/shared/permission.service';
import { DepartmentService } from '../shared/department.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrl: './department-form.component.scss'
})
export class DepartmentFormComponent extends ResourceFormComponent<IDepartment> implements OnInit, OnDestroy{

  permissions: IPermission[] = []
  dep_permissions: ICheckbox[] = []

  /**
   *
   */
  constructor(
    protected service: DepartmentService,
    protected injector: Injector,
    protected mainServ: MainService,
    protected pserv: PermissionService,
    protected helpServ: HelperService,
  ) {
    super(service, injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = IDepartment.fromJson;

  ngOnInit(): void {
    super.ngOnInit()
    this.loadPermissions()
  }
  //Método de construção do formulário
  protected buildForm(): void {
    this.form = this.formBuilder.group({
      id: [null],
      name: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      permissions: new FormArray([])
    })
  }
  //Método para o Bind do Formulário quando em Edição de Entidade
  protected bindFormData(resource: IDepartment): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/
    this.dep_permissions = this.helpServ.transformEntityToCheckboxFormat(resource.permissions)

    //Bind para popular formulario
    this.form.patchValue(resource);

    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)
    this.loadPermissions()

    this.mainServ.toggleLoading(false);
  }
  //Método de transformação dos dados para Submit do formulário
  protected bindFormDataToSubmit() {
    //Instanciando os dados do Formulário
    let formData = this.form.value;

    formData.permissions = []

    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica para o Submit*/
    formData.permissions = this.permissionsArray.value.filter(x => x.checked).map(({value}) => value)

    return formData;
  }

  get permissionsArray(): FormArray {
    return <FormArray>this.form.controls.permissions;
  }

  protected loadPermissions(filters?: any){
    this.pserv.getAll({...filters,  page: 1, limit: 10000}).forEach(
      result => {

        let dep_permissions = this.helpServ.transformEntityToCheckboxFormat(result.data)

        this.permissions = result.data.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        this.populatePermissionsOnFormArray(dep_permissions)

      }
    )
  }

  protected populatePermissionsOnFormArray(data: ICheckbox[]){

    //Limpar o array de permissions para repopular
    this.permissionsArray.value.map((p) => this.permissionsArray.removeAt(0))

    data.forEach(p => {
      let check = this.resource?.permissions?.find(x => x.id == p.value)
      let checked: boolean = false

      if(check){
        checked = true
      }

      this.permissionsArray.push(new FormControl({
        label: p.label,
        value: p.value,
        checked
      }))
    })
  }


  /* MÉTODOS DE CHAMADA
  Os Métodos abaixo são executados mediante Chamada no código
  */
  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}

