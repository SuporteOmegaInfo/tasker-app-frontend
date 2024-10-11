import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { FormValidations } from '../tools/form-validations';


@Component({
  selector: 'form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.scss'],
})
export class FormFieldErrorComponent {
  @Input() control: FormControl;
  @Input() label: string;

  get errorMessage() {
    for (const propertyName in this.control.errors) {
      if (
        this.control.errors.hasOwnProperty(propertyName) &&
        (this.control.touched || this.control.dirty)
      ) {
        // ToDo
        return FormValidations.getErrorMsg(
          this.label,
          propertyName,
          this.control.errors[propertyName],
          this.control.errors.val
        );
      }
    }

    return null;
  }
}
