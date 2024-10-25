import { Component, EventEmitter, Injector, Input, OnInit, Output } from '@angular/core';
import { IProject, IProjectStep } from '../../../entities/project';
import { ResourceFormComponent } from '../../base/resource-form/resource-form.component';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../pages/adm/users/shared/user.service';
import { ProjectStepService } from '../../../../../pages/client/project-steps/shared/project-step.service';
import { ProjectService } from '../../../../../pages/client/projects/shared/project.service';
import { MainService } from '../../../../core/services/main.service';
import { ModalService } from '../../ui/modal/modal.service';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs';
import { FormValidations } from '../inputs/tools/form-validations';
import { IUser } from '../../../entities/user';
import { BaseFormComponent } from '../../base/base-form/base-form.component';

@Component({
  selector: 'tasker-kanban-step-form',
  templateUrl: './tasker-kanban-step-form.component.html',
  styleUrl: './tasker-kanban-step-form.component.scss'
})
export class TaskerKanbanStepFormComponent extends BaseFormComponent implements OnInit{

  protected jsonDataToResourceFn: any;

  @Input() project_step: IProjectStep
  @Input() project: IProject
  @Output('step-saved') step_saved = new EventEmitter<IProjectStep>()

  constructor(
    protected mainServ: MainService,
    protected proServ: ProjectService,
    protected proStServ: ProjectStepService,
    protected router: Router,
    protected route: ActivatedRoute,
    protected injector: Injector,
    protected modalserv: ModalService,
    protected usServ: UserService
  ) {
    super(injector,mainServ);
  }

  ngOnInit(): void {
    this.buildForm()
    this.bindFormData(this.project_step)
  }

  protected submit(): void {

    this.mainServ.toggleSubmitting(true)

    if (this.form.invalid) {
      this.mainServ.toggleSubmitting(false);
      this.mainServ.toggleLoading(false)
      this.verifyFormValidations(this.form)
      return;
    }

    let data = this.bindFormDataToSubmit()

    if(this.form.valid){
      this.subs.push(
        this.proStServ.update(data).subscribe(
          result => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.toggleLoading(false)
            this.mainServ.sendToastr('success', 'Etapa atualizada com sucesso!')
            this.form.markAsPristine()
            this.form.markAsUntouched()
            this.step_saved.emit(result.data)
          },
          error => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.toggleLoading(false)
            this.mainServ.sendDefaultErrorToastr(error)
          }
        )
      )
    }

  }

  get membersArray(): FormArray {
    return <FormArray>this.form.controls.members;
  }

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
      project_id: [null],
      expires_at: [null, FormValidations.dateInFutureValidator],
      expires_at_2: [null],
      members: new FormArray([]),
    })

    this.subs.push(
      this.getField('expires_at').valueChanges.pipe(
        debounceTime(20),
        distinctUntilChanged()
      ).subscribe(
        result => {
          if(result){

            let time = this.getField('expires_at_2').value
            let date = format(result, 'yyyy-MM-dd HH:mm:ss')

            if(time){
              let dateFinal = date.substring(0, (date.length-8))+time+':00'
              this.getField('expires_at').patchValue(new Date(dateFinal))
            }
          }
          if(result == null){
            this.getField('expires_at').patchValue(null)
          }
        }
      ),
      this.getField('expires_at_2').valueChanges.pipe(
        debounceTime(20),
        distinctUntilChanged()
      ).subscribe(
        result => {

          if(result != ''){
            let date = format(new Date(this.getField('expires_at').value), 'yyyy-MM-dd HH:mm:ss').substring(0, (format(new Date(this.getField('expires_at').value), 'yyyy-MM-dd HH:mm:ss').length-8))
            let hours = result ? result : '00:00'
            let r = `${date}${hours}:00`

            this.getField('expires_at').patchValue(new Date(r))
          }else{

          }
        }
      )
    )
  }

  protected bindFormData(resource: IProjectStep) {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/

    //Bind para popular formulario
    // this.form.patchValue(resource);

    this.getField('id').patchValue(resource.id)
    this.getField('name').patchValue(resource.name)
    this.getField('project_id').patchValue(resource.project_id)

    if(resource.members && resource.members.length > 0){
      resource.members.map(x => this.membersArray.removeAt(0))
      resource.members.map(x => this.membersArray.push(new FormControl(x)))
    }

    if(resource.expires_at){
      this.getField('expires_at').patchValue(resource.expires_at)
      this.getField('expires_at_2').patchValue(format(new Date(this.project_step.expires_at), 'HH:mm'))
    }

    //Loop para popular o formArray com as Roles (deve ser executado após o Bind dos demais dados do Formulário)

    this.mainServ.toggleLoading(false);
  }

  protected bindFormDataToSubmit() {
    //Instanciando os dados do Formulário
    let formData = this.form.value;

    formData.members = []

    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica para o Submit*/
    formData.members = this.membersArray.value.map(({id}) => id)

    return formData;
  }

  public addStepMember(user: IUser){
    let membersCheck = this.membersArray.value.map(({id}) => id).indexOf(user.id)
    if(membersCheck < 0){
      this.membersArray.push(new FormControl(user))
      this.membersArray.markAsDirty()
      this.membersArray.markAllAsTouched()
      this.form.markAsDirty()
      this.form.markAsTouched()
    }
  }

  public removeStepMember(user: IUser){
    let userIndex = this.membersArray.value.map(({id}) => id).indexOf(user.id)
    if(userIndex >= 0){
      this.membersArray.removeAt(userIndex)
      this.membersArray.markAsDirty()
      this.membersArray.markAllAsTouched()
      this.form.markAsDirty()
      this.form.markAsTouched()
    }
  }

  public stepMembersAvailable(){
    return this.project.members.filter(x => {
      let index = this.membersArray.value.map(({id}) => id).indexOf(x.id)
      return index < 0
    })
  }

  public deleteStep(){
    this.mainServ.toggleLoading(true)
    this.proStServ.delete(this.project_step.id).subscribe(
      result => {
        this.mainServ.sendToastr('success', 'Etapa excluída com sucesso!')
        this.mainServ.toggleLoading(false)

        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
        this.router
          .navigateByUrl(baseComponentPath, { skipLocationChange: true })
          .then(() => {
            this.router.navigate([baseComponentPath, this.project.slug]);
          });
      },
      error => {
        this.mainServ.toggleLoading(false)
        this.mainServ.sendDefaultErrorToastr(error)
      }
    )
  }

  //Ação que altera o Título das Etapas quando se altera o dado no input
  public changedStepText(event, step: IProjectStep){
    this.mainServ.toggleLoading(true)
    this.getField('name').patchValue(event.newText)
    this.submit()
  }

}
