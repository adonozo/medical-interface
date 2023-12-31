import { AbstractControl, FormControl } from "@angular/forms";
import { FormStatus } from "../models/enums";

export abstract class FormComponent {
  formStatus: FormStatus = FormStatus.default;
  readonly formStatusType = FormStatus;

  getControlStatus = (control: FormControl): ('danger' | 'basic') =>
    this.isControlInvalid(control) ? 'danger' : 'basic';

  isControlInvalid = (control: AbstractControl | null): boolean =>
    control != null && control.invalid && (control.touched || control.dirty);

  abstract submitForm(): void;
}
