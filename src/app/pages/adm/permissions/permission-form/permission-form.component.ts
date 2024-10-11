import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { ResourceFormComponent } from '../../../../kernel/shared/components/base/resource-form/resource-form.component';
import { IPermission } from '../../../../kernel/shared/entities/permission';
import { Validators } from '@angular/forms';
import { PermissionService } from '../shared/permission.service';
import { MainService } from '../../../../kernel/core/services/main.service';

@Component({
  selector: 'app-permission-form',
  templateUrl: './permission-form.component.html',
  styleUrl: './permission-form.component.scss'
})
export class PermissionFormComponent extends ResourceFormComponent<IPermission> implements OnInit, OnDestroy{
  
  /**
   *
   */
  constructor(
    protected service: PermissionService,
    protected injector: Injector,
    protected mainServ: MainService,
  ) {
    super(service, injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = IPermission.fromJson;

  ngOnInit(): void {
    super.ngOnInit()
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
    })
  }
  //Método para o Bind do Formulário quando em Edição de Entidade
  protected bindFormData(resource: IPermission): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/

    //Bind para popular formulario
    this.form.patchValue(resource);

    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)

    this.mainServ.toggleLoading(false);
  }
  //Método de transformação dos dados para Submit do formulário
  protected bindFormDataToSubmit() {
    //Instanciando os dados do Formulário
    let formData = this.form.value;

    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica para o Submit*/

    return formData;
  }

  /* MÉTODOS DE CHAMADA
  Os Métodos abaixo são executados mediante Chamada no código
  */
  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }

}
