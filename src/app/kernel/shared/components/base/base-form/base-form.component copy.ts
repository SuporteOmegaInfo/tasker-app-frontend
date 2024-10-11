import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { IBaseEntity } from '../../../interfaces/base-entity';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { BaseResourceService } from '../../../services/base-resource.service';
import { MainService } from '../../../../core/services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  template: '',
})
export class BaseFormComponent<T extends IBaseEntity> implements OnInit, OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];
  submittingForm: boolean = false;
  loading: boolean = false;
  formChange: boolean = false;
  resource: T;
  
  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected service: BaseResourceService<T>,
    protected mainServ: MainService,
    private toastr: ToastrService
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
  }

  ngOnInit() {

  }

  onInput() {
    this.formChange = true;
  }
  resetForm() {
    this.form.reset();
  }
  getField(field: string) {
    return this.form.get(field);
  }
  verifyFormValidations(formGroup: FormGroup | FormArray) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      control.markAsDirty();
      control.markAsTouched();
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.verifyFormValidations(control);
      }
    });
  }
  verifyFormFieldsValidations(
    formGroup: FormGroup | FormArray,
    fields: string[]
  ) {
    fields.forEach((field) => {
      if (formGroup.get(field)) {
        const control = formGroup.get(field);
        control.markAsDirty();
        control.markAsTouched();
      }
    });
  }
  verifyValidTouched(field: string) {
    return (
      !this.getField(field).valid &&
      (this.getField(field).touched || this.getField(field).dirty)
    );
  }
  verifyIsValidTouched(field: string) {
    return (
      this.getField(field).valid &&
      (this.getField(field).touched || this.getField(field).dirty)
    );
  }
  applyErrorCss(field: string) {
    return {
      'has-danger': this.verifyValidTouched(field),
      'has-success': this.verifyIsValidTouched(field),
    };
  }

  //Fim do Ciclo do Componente
  ngOnDestroy() {
    this.subs.forEach((subscription) => subscription.unsubscribe());
  }
}
