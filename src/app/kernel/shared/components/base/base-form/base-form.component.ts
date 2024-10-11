import { Component, Injector, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MainService } from '../../../../core/services/main.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  template: '',
})
export abstract class BaseFormComponent implements OnDestroy {

  form: FormGroup;
  subs: Subscription[] = [];
  submittingForm: boolean = false;
  loading: boolean = false;
  formChange: boolean = false;
  
  protected route: ActivatedRoute;
  protected router: Router;
  protected formBuilder: FormBuilder;

  /**
   *
   */
  constructor(
    protected injector: Injector,
    protected mainServ: MainService,
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.formBuilder = this.injector.get(FormBuilder);
    this.mainServ.currentLoading.subscribe(ld => this.loading = ld)
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

  protected abstract buildForm(): void;
  protected abstract submit(): void;
}
