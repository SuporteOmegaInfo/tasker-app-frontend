import { Component, ElementRef, EventEmitter, Injector, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { format } from 'date-fns';
import { debounceTime, distinctUntilChanged } from 'rxjs';

import { UserService } from '../../../../../pages/adm/users/shared/user.service';
import { ProjectService } from '../../../../../pages/client/projects/shared/project.service';
import { MainService } from '../../../../core/services/main.service';
import { IProject } from '../../../entities/project';
import { IUser } from '../../../entities/user';
import { BaseFormComponent } from '../../base/base-form/base-form.component';
import { ModalService } from '../../ui/modal/modal.service';
import { FormValidations } from '../inputs/tools/form-validations';

@Component({
  selector: 'add-project-button-form',
  templateUrl: './add-project-button-form.component.html',
  styleUrl: './add-project-button-form.component.scss'
})
export class AddProjectButtonFormComponent extends  BaseFormComponent implements OnInit {

  users: IUser[] = []

  @Output('project-added') projectAdded = new EventEmitter<IProject>(null)
  @ViewChildren("members") private members: QueryList<ElementRef>;

  /**
   *
   */
  constructor(
    protected service: ProjectService,
    protected injector: Injector,
    protected mainServ: MainService,
    protected usServ: UserService,
    protected modalServ: ModalService,
    protected proServ: ProjectService
  ) {
    super(injector, mainServ);
    this.buildForm()
  }

  jsonDataToResourceFn = IProject.fromJson;

  ngOnInit(): void {}

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
      color: [null],
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
  public submit(): void {

    this.mainServ.toggleSubmitting(true)

    if (this.form.invalid) {
      this.mainServ.toggleSubmitting(false);
      this.verifyFormValidations(this.form)
      return;
    }

    let data = this.bindFormDataToSubmit()

    if(this.form.valid){
      this.subs.push(
        this.proServ.create(data).subscribe(
          result => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.sendToastr('success', 'Projeto adicionado com sucesso!')
            this.projectAdded.emit(result.data)
            this.closeModal()
          },
          error => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.sendDefaultErrorToastr(error)
          }
        )
      )
    }
  }

  protected bindFormData(resource: IProject): void {
    /* Adiciona-se aqui, todas as ações necessárias para popular o formulário
    caso necessite executar alguma ação não genérica*/

    //Bind para popular formulario
    this.form.patchValue(resource);

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

  protected loadMembers(filters?: any){
    this.users = []
    this.usServ.getMembers({page: 1, limit: 10000}).forEach(
      result => {
        this.users = result.data.sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });

      }
    )
  }

  protected addMember(member){
    if(this.membersArray.value.map(({id}) => id).indexOf(member.id) >= 0){
      this.mainServ.sendToastr('warning', 'Membro já adicionado à lista.')
      return
    }
    this.membersArray.push(new FormControl(member))
  }

  protected removeMember(index: number){

    let members = this.members.first.nativeElement.children
    const div = members[index].querySelector('.members-avatar')

    div.classList.add('removing')

    setTimeout(() => {
      if(this.membersArray.value[index]){
        this.membersArray.removeAt(index)
      }
    }, 500);

  }

  get membersArray(): FormArray {
    return <FormArray>this.form.controls.members;
  }

  usersAvailableToAdd(){
    if(this.membersArray.value && this.membersArray.value.length > 0){
      return this.users.filter(x => this.membersArray.value.map(({id}) => id).indexOf(x.id) < 0)
    }else{
      return this.users
    }
  }

  openModal(){
    this.modalServ.open('add-project')
  }

  closeModal(){
    if(this.form.dirty){
      this.form.reset()
    }
    if(this.membersArray?.value?.length > 0){
      this.membersArray.value.forEach(element => this.membersArray.removeAt(0));
    }
    this.modalServ.close('add-project')
  }

  getContrastYIQ(hexcolor) {

    if(hexcolor == '' || hexcolor == null){
      return
    }

    // Remove o símbolo de hashtag se presente
    hexcolor = hexcolor.replace("#", "");

    // Converte a cor de hexadecimal para RGB
    var r = parseInt(hexcolor.substring(0, 2), 16);
    var g = parseInt(hexcolor.substring(2, 4), 16);
    var b = parseInt(hexcolor.substring(4, 6), 16);

    // Calcula o valor de YIQ para determinar se a cor é clara ou escura
    var yiq = (r * 299 + g * 587 + b * 114) / 1000;

    // Se o valor de YIQ for maior que 128, a cor é clara, então o contraste será preto
    // Caso contrário, o contraste será branco
    return yiq >= 128 ? '#495057' : '#fff';
  }


  ngOnDestroy() {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }

}
