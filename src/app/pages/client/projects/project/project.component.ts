import { AfterViewChecked, Component, Injector, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { format } from 'date-fns';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Subscription } from 'rxjs';

import { MainService } from '../../../../kernel/core/services/main.service';
import { BaseFormComponent } from '../../../../kernel/shared/components/base/base-form/base-form.component';
import { FormValidations } from '../../../../kernel/shared/components/forms/inputs/tools/form-validations';
import { ModalService } from '../../../../kernel/shared/components/ui/modal/modal.service';
import { IProject, IProjectStep } from '../../../../kernel/shared/entities/project';
import { IUser } from '../../../../kernel/shared/entities/user';
import { UserService } from '../../../adm/users/shared/user.service';
import { ProjectStepService } from '../../project-steps/shared/project-step.service';
import { ProjectService } from '../shared/project.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent extends BaseFormComponent implements OnInit, AfterViewChecked {

  project: IProject
  sub: Subscription[] = []
  membersList: IUser[] = []
  toggleModal: BehaviorSubject<any> = new BehaviorSubject<any>(null)

  /**
   *
   */
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
    this.loadPageData();
  }

  ngAfterViewChecked(): void {
    //Tratamento para padronização dos ícones do datepicker ded acordo com a dinâmica de tema do projeto
    let iconsToChangeColor = Array.from(document.querySelectorAll('.mat-datepicker-toggle-default-icon, .picker-icon'));
    if(iconsToChangeColor.length > 0){
      iconsToChangeColor.map(item => {

        let color = this.getContrastYIQ(this.project?.color)

        if (item instanceof HTMLElement) {
          item.style.setProperty('color', color, 'important');
        }

        if (item instanceof SVGElement) {
          item.setAttribute('fill', color);
        }

      })
    }
  }

  ngOnInit(): void {
    this.buildForm()

    this.sub.push(
      this.usServ.getMembers().subscribe(
        result => this.membersList = result.data
      )
    )
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

  protected submit(): void {

    this.mainServ.toggleSubmitting(true)

    if (this.form.invalid) {
      this.mainServ.toggleSubmitting(false);
      this.verifyFormValidations(this.form)
      return;
    }

    let data = this.bindFormDataToSubmit()

    if(this.form.valid){
      this.subs.push(
        this.proServ.update(data).subscribe(
          result => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.sendToastr('success', 'Projeto alterado com sucesso!')
            const baseComponentPath: string = this.route.snapshot.parent.url[0].path;

            this.router
            .navigateByUrl(baseComponentPath, { skipLocationChange: true })
            .then(() => {
              if (result.data.slug) {
                this.router.navigate([baseComponentPath, result.data.slug]);
              } else {
                this.router.navigate([baseComponentPath, result.data.id]);
              }
            });
          },
          error => {
            this.mainServ.toggleSubmitting(false)
            this.mainServ.sendDefaultErrorToastr(error)
          }
        )
      )
    }

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
  //Carregamento do projeto
  protected loadPageData(){
    let id_or_slug = this.route.snapshot.url[0].path

    this.sub.push(
      this.proServ.getById(id_or_slug).subscribe(
        result => {
          this.project = result.data

          this.project.members.map(member => {
            this.membersArray.push(new FormControl(member))
          })

          this.project.steps = this.project.steps.map(step => {
            let date = format(new Date(step.expires_at), 'HH:mm')
            return {
              ...step,
              expires_at_2: step.expires_at ? date : null
            }
          })

          this.form.patchValue(this.project)
          this.form.get('expires_at_2').patchValue(format(new Date(this.project.expires_at), 'HH:mm'))
        },
        error => {
          this.mainServ.sendDefaultErrorToastr(error)
        }
      )
    )
  }

  get membersArray(): FormArray {
    return <FormArray>this.form.controls.members;
  }

  //Escurece uma porcentagem definida de uma cor informada
  public darkenColorPercent(hex, percentual) {
    // Remove o "#" caso exista
    hex = hex.replace("#", "");

    // Converte hexadecimal para RGB
    let r = parseInt(hex.substring(0, 2), 16);
    let g = parseInt(hex.substring(2, 4), 16);
    let b = parseInt(hex.substring(4, 6), 16);

    // Aplica o percentual de escurecimento
    r = Math.floor(r * (1 - percentual / 100));
    g = Math.floor(g * (1 - percentual / 100));
    b = Math.floor(b * (1 - percentual / 100));

    // Garante que os valores fiquem no intervalo [0, 255]
    r = Math.max(0, Math.min(255, r));
    g = Math.max(0, Math.min(255, g));
    b = Math.max(0, Math.min(255, b));

    // Converte de volta para hexadecimal
    const newColor = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

    return newColor;
  }
  //Verifica claridade da cor e aplica uma cor de contraste preta ou branca
  public getContrastYIQ(hexcolor) {

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
  //Aplica a sombra dos cartões de acordo com a cor informada
  public styleCardShadow(color){
    return `3px 3px 5px ${color}`
  }
  //Aplica a alteração da cor do projeto na tela
  public refreshThemeColor(){
    this.project.color = this.form.get('color').value
    this.getField('color').markAsDirty()
  }
  //Abre o modal de membros do projeto
  public openMembers(){
    this.modalserv.setData(this.project)
    this.modalserv.open('members-project')
  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
