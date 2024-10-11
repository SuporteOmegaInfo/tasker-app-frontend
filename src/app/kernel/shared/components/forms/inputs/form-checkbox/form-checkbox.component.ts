import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MainService } from '../../../../../core/services/main.service';

@Component({
  selector: 'form-checkbox',
  templateUrl: './form-checkbox.component.html',
  styleUrls: ['./form-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormCheckboxComponent),
      multi: true
    }
  ]
})
export class FormCheckboxComponent implements ControlValueAccessor, OnInit {

  @Input() formGroup?: FormGroup;
  @Input() cssClass?: any;
  @Input() elementId?: string;
  @Input() label?: string;
  @Input() showLabel?: boolean;
  @Input() isReadOnly: boolean = false;
  @Input() formGroupName?: string;
  loading = false;

  onChange: any = () => {};
  onTouch: any = () => {};

  touched = false;
  checked: boolean = false;
  disabled = false;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouch();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  constructor(protected mainServ: MainService) {
    this.mainServ.currentLoading.subscribe((ld) => {
      this.loading = ld;
    });
  }

  ngOnInit() {}

  writeValue(checked: boolean) {
    this.checked = checked;
  }

  onModelChange(e) {
    // Step 5a: bind the changes to the local value
    this.checked = e.target.checked;

    // Step 5b: Handle what should happen on the outside, if something changes on the inside
    this.onChange(e);
  }
}
