import { Component, forwardRef, Input } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { MainService } from '../../../../../core/services/main.service';

const INPUT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormInputGroupComponent),
  multi: true,
};

@Component({
  selector: 'form-input-group',
  templateUrl: './form-input-group.component.html',
  styleUrls: ['./form-input-group.component.scss'],
  providers: [INPUT_ACCESSOR],
})
export class FormInputGroupComponent implements ControlValueAccessor {
  loading: boolean = false;

  @Input() formGroup: string;
  @Input() cssClass;
  @Input() masker: string;
  @Input() elementId: string;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() type: string;
  @Input() control;
  @Input() icon: string;
  @Input() placeholder: string;
  @Input() isReadOnly = false;
  @Input() fullWidth = false;

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

  cssFullWidth() {
    return {
      'w-100': this.fullWidth,
    };
  }
}
