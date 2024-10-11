import { Component, forwardRef, Input, OnInit, Renderer2 } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { MainService } from '../../../../../core/services/main.service';

const INPUT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormDatepickerComponent),
  multi: true,
};
@Component({
  selector: 'form-datepicker',
  templateUrl: './form-datepicker.component.html',
  styleUrls: ['./form-datepicker.component.scss'],
  providers: [INPUT_ACCESSOR],
})
export class FormDatepickerComponent implements ControlValueAccessor, OnInit {
  @Input() formGroup: FormGroup;
  @Input() cssClass;
  @Input() masker: string;
  @Input() elementId: string;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() type: string;
  @Input() control;
  @Input() placeholder: string;
  @Input() isReadOnly = false;

  loading = false;

  constructor(protected renderer: Renderer2, public mainServ: MainService) {}

  ngOnInit() {}

  private internalValue: any;

  get value() {
    return this.internalValue;
  }

  set value(v: any) {
    if (v !== this.internalValue) {
      this.internalValue = v;

      this.onChangeCb(v);
    }
  }

  resetValue(){
    this.control.reset()
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
