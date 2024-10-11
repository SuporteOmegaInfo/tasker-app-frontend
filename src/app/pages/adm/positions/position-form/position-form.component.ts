import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';

import { MainService } from '../../../../kernel/core/services/main.service';
import { ResourceFormComponent } from '../../../../kernel/shared/components/base/resource-form/resource-form.component';
import { IDepartment } from '../../../../kernel/shared/entities/department';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { IPosition } from '../../../../kernel/shared/entities/position';
import { ICheckbox } from '../../../../kernel/shared/interfaces/ui/checkbox';
import { ISelectItem } from '../../../../kernel/shared/interfaces/ui/select';
import { HelperService } from '../../../../kernel/shared/services/helper.service';
import { DepartmentService } from '../../departments/shared/department.service';
import { PermissionService } from '../../permissions/shared/permission.service';
import { PositionService } from '../shared/position.service';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { CompanyService } from '../../companies/shared/company.service';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrl: './position-form.component.scss'
})
export class PositionFormComponent extends ResourceFormComponent<IPosition> implements OnInit, OnDestroy{


  permissions: IPermission[] = []
  dep_permissions: ICheckbox[] = []
  departments: IDepartment[] = []
  departments_select: ISelectItem[] = []

  /**
   *
   */
  constructor(
    protected service: PositionService,
    protected injector: Injector,
    protected mainServ: MainService,
    protected pserv: PermissionService,
    protected dpserv: DepartmentService,
    protected helpServ: HelperService,
    protected compserv: CompanyService
  ) {
    super(service, injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = IPosition.fromJson;

  ngOnInit(): void {
    super.ngOnInit()
    this.loadDepartments()
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
      department_id: [null],
      permissions: new FormArray([])
    })
    //Alterar as Permissões do departamento no formulário toda vez que trocar o departamento do Perfil
    this.getField('department_id').valueChanges.subscribe(
      changes => {
        if(changes){
          let selected_department = this.departments.find(x=> x.id == changes)

          if(selected_department && selected_department.permissions){
            this.dep_permissions = this.helpServ.transformEntityToCheckboxFormat(selected_department.permissions || []) || []
            if(this.currentAction == 'edit'){
              this.resource.department = selected_department
              //this.resource.permissions = changes.permissions
            }
            this.organizePermissions()
          }

        }
      }
    )
  }
  //Método para o Bind do Formulário quando em Edição de Entidade
  protected bindFormData(resource: IPosition): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/
    if(resource.department && resource.department.permissions){
      this.dep_permissions = this.helpServ.transformEntityToCheckboxFormat(resource.department.permissions)
    }

    //Bind para popular formulario
    this.form.patchValue(resource);

    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)
    this.loadPermissions()
    this.loadDepartments()


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

  protected organizePermissions(){
    //Removendo as permissões do departamento para não serem selecionáveis
    let permissions = this.processDepartmentPermissions()

    //Populando o permissionsArray
    this.populatePermissionsOnFormArray(permissions)
  }

  protected processDepartmentPermissions(): ICheckbox[] {

    let dep_permissions = []
    if(this.resource){
      dep_permissions = this.departments.find(x => x.id == this.getField('department_id').value)?.permissions?.map(({id}) => id) || []
    }else{
      if(this.getField('department_id').value){

        let id = this.getField('department_id').value
        let department = this.departments.find(x => x.id == id)

        dep_permissions = this.permissions.filter(x => department.permissions.map(({id}) => id).indexOf(x.id) >= 0).map(({id}) => id)

      }
    }

    let permissionsList = this.helpServ.transformEntityToCheckboxFormat(this.permissions).filter((x: ICheckbox) => {
      return !dep_permissions.includes(x.value)
    })


    permissionsList = permissionsList.sort(function (a, b) {
      if (a.label < b.label) {
        return -1;
      }
      if (a.label > b.label) {
        return 1;
      }
      return 0;
    });

    return permissionsList
  }

  protected populatePermissionsOnFormArray(data: ICheckbox[]){

    //Limpar o array de permissions para repopular
    this.permissionsArray.value.map((p, i) => this.permissionsArray.removeAt(0))

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

  protected loadPermissions(filters?: any): void{
    this.pserv.getAll({...filters, page: 1, limit: 10000}).forEach(
      result => {
        this.permissions = result.data.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

        this.organizePermissions()
      }
    )
  }
  protected loadDepartments(filters?: any): void{
    this.dpserv.getAll({...filters, page: 1, limit: 10000}).forEach(
      result => {
        this.departments = result.data
        this.departments_select = this.helpServ.transformEntityToSelectFormat(result.data).sort(function (a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });
      }
    )
  }

  get permissionsArray(): FormArray {
    return <FormArray>this.form.controls.permissions;
  }

  /* MÉTODOS DE CHAMADA
  Os Métodos abaixo são executados mediante Chamada no código
  */
  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}
