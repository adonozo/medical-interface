import { Component } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { TimeOfDay } from "../medication-request-form/form-data";
import { FormComponent } from "../../../@core/components/form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent extends FormComponent {
  timesOfDay = TimeOfDay;
  observationForm: FormGroup;

  constructor(
    private dialogRef: NbDialogRef<any>,
    private formBuilder: FormBuilder,
  ) {
    super();
    this.observationForm = this.formBuilder.group({
      value: this.formBuilder.control('', [Validators.required]),
      date: this.formBuilder.control('', [Validators.required]),
      timing: this.formBuilder.control('', [])
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  get valueControl(): FormControl {
    return this.observationForm.get('value') as FormControl;
  }

  get dateControl(): FormControl {
    return this.observationForm.get('date') as FormControl;
  }

  get timingControl(): FormControl {
    return this.observationForm.get('timing') as FormControl;
  }

  submitForm(): void {
  }
}
