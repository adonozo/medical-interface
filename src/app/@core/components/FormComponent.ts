import { AbstractControl, FormControl } from "@angular/forms";

export abstract class FormComponent {
  public getControlStatus = (control: FormControl): ('danger' | 'basic') =>
    this.isControlInvalid(control) ? 'danger' : 'basic';

  public isControlInvalid = (control: AbstractControl): boolean => control.invalid && (control.touched || control.dirty);

  abstract submitForm(): void;
}
