import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { skip } from 'rxjs';

import { MainService } from '../../../../kernel/core/services/main.service';
import { ResourceFormComponent } from '../../../../kernel/shared/components/base/resource-form/resource-form.component';
import { FormValidations } from '../../../../kernel/shared/components/forms/inputs/tools/form-validations';
import { ICompany } from '../../../../kernel/shared/entities/company';
import { IDepartment } from '../../../../kernel/shared/entities/department';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { IPosition } from '../../../../kernel/shared/entities/position';
import { IUser } from '../../../../kernel/shared/entities/user';
import { ICheckbox } from '../../../../kernel/shared/interfaces/ui/checkbox';
import { ISelectItem } from '../../../../kernel/shared/interfaces/ui/select';
import { HelperService } from '../../../../kernel/shared/services/helper.service';
import { CompanyService } from '../../companies/shared/company.service';
import { DepartmentService } from '../../departments/shared/department.service';
import { PermissionService } from '../../permissions/shared/permission.service';
import { PositionService } from '../../positions/shared/position.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent extends ResourceFormComponent<IUser> implements OnInit, OnDestroy{

  permissions: IPermission[] = []
  departments: IDepartment[] = []
  positions: IPosition[] = []
  companies: ICompany[] = []

  pos_permissions: ICheckbox[] = []
  dep_permissions: ICheckbox[] = []

  departments_select: ISelectItem[] = []
  positions_select: ISelectItem[] = []
  companies_select: ISelectItem[] = []

  /**
   *
   */
  constructor(
    protected service: UserService,
    protected injector: Injector,
    protected mainServ: MainService,
    protected pserv: PermissionService,
    protected dpserv: DepartmentService,
    protected poserv: PositionService,
    protected compserv: CompanyService,
    protected helpServ: HelperService
  ) {
    super(service, injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = IUser.fromJson;

  ngOnInit(): void {
    super.ngOnInit()
    this.loadDepartments()
    this.loadPositions()
    this.loadPermissions()
    this.loadCompanies()
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
      email: [
        null,
        [
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      cpf: [
        null,
        [
          Validators.required,
          FormValidations.cpfValidator,
          Validators.minLength(1),
          Validators.maxLength(11),
        ],
      ],
      phone: [
        null,
        [
          Validators.minLength(1),
          Validators.maxLength(11),
        ],
      ],
      department_id: [null],
      position_id: [null],
      company_id: [this.mainServ.currentSession.user.company_id],
      permissions: new FormArray([])
    })

    this.getField('department_id').valueChanges.pipe(
      skip(1)
    ).subscribe(
      changes => {
        if(changes){
          let selected_department = this.departments.find(x=> x.id == changes)
          this.resource.department_id = changes
          if(selected_department && selected_department.permissions){
            this.dep_permissions = this.helpServ.transformEntityToCheckboxFormat(selected_department.permissions || []) || []
            this.resource.department = selected_department
          }

          if(selected_department){
            this.getField('position_id').reset()
            this.pos_permissions = []
            this.loadPositions({ department_id: selected_department.id })
          }

          this.organizePermissions()

        }
      }
    )

    this.getField('position_id').valueChanges.pipe(
      skip(1)
    ).subscribe(
      changes => {
        if(changes){
          if(this.permissions.length > 0){
            let selected_position = this.positions.find(x=> x.id == changes)
            this.resource.position_id = changes
            if(selected_position && selected_position.permissions){
              this.pos_permissions = this.helpServ.transformEntityToCheckboxFormat(selected_position.permissions || []) || []
              this.resource.position = selected_position
              //this.resource.permissions = changes.permissions
            }

            if(!selected_position.permissions){
              this.pos_permissions = []
            }

            }
            this.organizePermissions()
        }
      }
    )
  }
  //Método para o Bind do Formulário quando em Edição de Entidade
  protected bindFormData(resource: IUser): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/
    this.dep_permissions = resource.department ? this.helpServ.transformEntityToCheckboxFormat(resource.department.permissions) : []
    this.pos_permissions = resource.position ? this.helpServ.transformEntityToCheckboxFormat(resource.position.permissions) : []

    //Bind para popular formulario
    this.form.patchValue(resource);
    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)

    this.loadDepartments()
    this.loadPositions()
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

  protected organizePermissions(){
    //Removendo as permissões do departamento para não serem selecionáveis
    let permissions = this.processRelatedPermissions()
    //permissions = this.processDepartmentPermissions()

    //Populando o permissionsArray
    this.populatePermissionsOnFormArray(permissions)
  }

  protected processRelatedPermissions(): ICheckbox[] {

    let dep_permissions = []
    let pos_permissions = []

    if(this.resource){
      dep_permissions = this.resource.department ? this.departments.find(x => x.id == this.getField('department_id').value)?.permissions?.map(({id}) => id) || [] : []
      pos_permissions = this.resource.position ? this.positions.find(x => x.id == this.getField('position_id').value)?.permissions?.map(({id}) => id) || [] : []
    }else{
      if(this.getField('department_id').value){
        let id = this.getField('department_id').value
        let department = this.departments.find(x => x.id == id)

        dep_permissions = this.permissions.filter(x => department.permissions.map(({id}) => id).indexOf(x.id) >= 0).map(({id}) => id)
      }
      if(this.getField('position_id').value){
        let id = this.getField('position_id').value
        let position = this.positions.find(x => x.id == id)

        pos_permissions = this.permissions.filter(x => position.permissions.map(({id}) => id).indexOf(x.id) >= 0).map(({id}) => id)
      }
    }

    let permissionsList = this.helpServ.transformEntityToCheckboxFormat(this.permissions).filter((x: ICheckbox) => {
      return !dep_permissions.includes(x.value) && !pos_permissions.includes(x.value)
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

    this.mainServ.toggleLoading(false);
  }

  protected loadPositions(filters?: any){
    this.poserv.getAll({ ...filters, page: 1, limit: 10000}).forEach(
      result => {
        this.positions = result.data
        this.positions_select = this.helpServ.transformEntityToSelectFormat(result.data).sort(function (a, b) {
          if (a.label < b.label) {
            return -1;
          }
          if (a.label > b.label) {
            return 1;
          }
          return 0;
        });
      },
    )
  }

  protected loadDepartments(filters?: any){
    this.dpserv.getAll({page: 1, limit: 10000}).forEach(
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
      },
    )
  }

  protected loadCompanies(filters?: any){
    this.compserv.getAll({page: 1, limit: 10000}).forEach(
      result => {
        this.companies = result.data
        this.companies_select = this.helpServ.transformEntityToSelectFormat(result.data).sort(function (a, b) {
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

  protected loadPermissions(filters?: any){
    this.pserv.getAll({page: 1, limit: 10000}).forEach(
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

  public canChangeCompanies(){
    return this.mainServ.currentSession.user.department_id < 3
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
