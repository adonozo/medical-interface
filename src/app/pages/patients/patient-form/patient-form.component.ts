import { Component } from '@angular/core';
import { Location } from "@angular/common";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent {

  constructor(
    private location: Location
  ) { }

  public goBack(): void {
    this.location.back();
  }
}
