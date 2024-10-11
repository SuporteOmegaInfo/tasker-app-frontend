import { Component, ElementRef, forwardRef, Input, OnInit, Renderer2 } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from '@angular/forms';
import { MainService } from '../../../../../core/services/main.service';

const INPUT_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormTimepickerComponent),
  multi: true,
};

@Component({
  selector: 'form-timepicker',
  templateUrl: './form-timepicker.component.html',
  styleUrl: './form-timepicker.component.scss',
  providers: [INPUT_ACCESSOR],
})
export class FormTimepickerComponent implements ControlValueAccessor, OnInit{
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

  element: ElementRef

  get elementRef() {
    return this.element.nativeElement.querySelector('input').value
  }

  constructor(protected renderer: Renderer2, private el: ElementRef, public mainServ: MainService) {
    this.element = el
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
