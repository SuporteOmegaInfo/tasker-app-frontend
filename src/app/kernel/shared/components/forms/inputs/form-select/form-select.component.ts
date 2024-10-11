import { Component, ElementRef, forwardRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MainService } from '../../../../../core/services/main.service';

const INPUT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormSelectComponent),
  multi: true,
};

@Component({
  selector: 'form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.scss'],
  providers: [INPUT_ACCESSOR],
})
export class FormSelectComponent implements ControlValueAccessor, OnInit {
  @Input() formGroup: FormGroup;
  @Input() cssClass;
  @Input() elementId: string;
  @Input() label: string;
  @Input() showLabel: boolean;
  @Input() control;
  @Input() options: any[];
  @Input() isReadOnly = false;

  loading = false;

  constructor(protected renderer: Renderer2, public mainServ: MainService) {
    this.mainServ.currentLoading.subscribe((ld) => {
      this.loading = ld;
    });
  }

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
