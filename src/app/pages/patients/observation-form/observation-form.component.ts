import { Component } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { TimeOfDay } from "../medication-request-form/form-data";

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent {
  timesOfDay = TimeOfDay;

  constructor(
    private dialogRef: NbDialogRef<any>
  ) {
  }

  close(): void {
    this.dialogRef.close();
  }
}
