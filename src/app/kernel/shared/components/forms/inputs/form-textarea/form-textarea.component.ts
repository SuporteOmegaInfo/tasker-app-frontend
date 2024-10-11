import { Component, ElementRef, forwardRef, Input } from '@angular/core';
import { FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MainService } from '../../../../../core/services/main.service';


const INPUT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormTextareaComponent),
  multi: true,
};

@Component({
  selector: 'form-textarea',
  templateUrl: './form-textarea.component.html',
  styleUrls: ['./form-textarea.component.scss'],
  providers: [INPUT_ACCESSOR],
})
export class FormTextareaComponent {
  @Input() formGroup: FormGroup;
  @Input() cssClass;
  @Input() elementId: string;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() rows?: number;
  @Input() cols?: number;
  @Input() control;
  @Input() isReadOnly = false;

  loading: boolean = false;

  private internalValue: any;

  constructor(public mainServ: MainService) {
    this.mainServ.currentLoading.subscribe((ld) => {
      this.loading = ld;
    });
  }

  get value() {
    return this.internalValue;
  }

  set value(v: any) {
    if (v !== this.internalValue) {
      this.internalValue = v;

      this.onChangeCb(v);
    }
  }

  onChangeCb: (_: any) => void = () => {};
  onTouchedCb: (_: any) => void = () => {};

  writeValue(obj: any): void {
    this.value = obj;
  }
  registerOnChange(fn: any): void {
    this.onChangeCb = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isReadOnly = isDisabled;
  }
}
