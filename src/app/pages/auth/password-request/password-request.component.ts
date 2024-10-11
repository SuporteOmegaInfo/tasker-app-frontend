import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { MainService } from '../../../kernel/core/services/main.service';
import { BaseFormComponent } from '../../../kernel/shared/components/base/base-form/base-form.component';
import { AuthService } from '../shared/auth.service';
import { FormValidations } from '../../../kernel/shared/components/forms/inputs/tools/form-validations';

@Component({
  selector: 'app-password-request',
  templateUrl: './password-request.component.html',
  styleUrl: './password-request.component.scss'
})
export class PasswordRequestComponent extends BaseFormComponent implements OnInit, OnDestroy{
  sub: Subscription[] = [];
  stage: number = 0;

  /**
   *
   */
  constructor(
    protected injector: Injector,
    private authService: AuthService,
    protected mainServ: MainService,
    protected router: Router
  ) {
    super(injector, mainServ);
    this.mainServ.currentSubmitting.subscribe((sb) => {
      this.submittingForm = sb;
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.buildForm()
  }

  buildForm() {
    this.form = this.formBuilder.group({
      email: [null, [Validators.email]],
      code: [null],
      password: [null],
      confirmation: [null, FormValidations.equalsTo('password')]
    })
  }

  submit(){
    this.mainServ.toggleSubmitting(true);

    // stop here if form is invalid
    if (this.f.invalid) {
      this.mainServ.toggleSubmitting(false);
      return;
    }

    //Se o código está vazio, processar o envio da recuperação de senha
    if(!this.getField('code').value){
      this.sub.push(
        this.authService
          .requestPassword(this.f.email.value)
          .subscribe(
            (data) => this.actionsForSuccess(data),
            (error) => this.actionsForError(error)
          )
      );
    }

    //Se o e-mail está vazio, processar o envio do token
    if(this.getField('email').value, this.getField('code').value){
      this.sub.push(
        this.authService
          .validateRequestPassword(this.f.email.value, this.f.code.value)
          .subscribe(
            (data) => this.actionsForSuccess(data),
            (error) => this.actionsForError(error)
          )
      );
    }

    //Se a senha foi preenchida, enviar a nova senha
    if(this.getField('email').value, this.getField('code').value, this.getField('password').value){
      this.sub.push(
        this.authService
          .changePassword(this.f.email.value, this.f.code.value, this.f.password.value)
          .subscribe(
            (data) => this.actionsForSuccess(data),
            (error) => this.actionsForError(error)
          )
      );
    }
  }

  protected actionsForSuccess(data: any) {
    this.mainServ.toggleSubmitting(false);
    if(data.message){
      this.mainServ.sendToastr('warning', data.message)
    }else{
      this.mainServ.sendToastr('success', 'Solicitação processada com sucesso!')
    }
    this.stage < 3 ? this.stage++ : this.stage = this.stage
  }

  protected actionsForError(error) {
    this.mainServ.toggleSubmitting(false);

    let erray: string[] = []

    if(error.status == 422){
      erray = error.error.errors.map(err => err.message)
    }

    if (error.status == 404 || error.status == 401) {
      erray.push('Não foram encontrados dados com as informações inseridas.')
    }else{
      erray.push(error?.error?.message)
    }

    if(typeof error == 'string'){
      erray.push(error)
    }

    erray.forEach(e => {
      if(e){
        this.mainServ.sendDefaultErrorToastr(error)
      }
    })


  }

  ngOnDestroy() {
    this.sub.forEach((subscription) => subscription.unsubscribe());
  }
}
