import { Component } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { TimeOfDay } from "../medication-request-form/form-data";
import { FormComponent } from "../../../@core/components/form.component";

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent extends FormComponent {
  timesOfDay = TimeOfDay;

  constructor(
    private dialogRef: NbDialogRef<any>
  ) {
    super();
  }

  close(): void {
    this.dialogRef.close();
  }

  submitForm(): void {
  }
}
