import { Component, Input } from '@angular/core';
import { CarePlan, Patient } from "fhir/r4";
import * as patientUtils from "../../../../@core/services/utils/patient-utils";

@Component({
  selector: 'app-care-plan-details',
  templateUrl: './care-plan-details.component.html',
  styleUrls: ['./care-plan-details.component.scss']
})
export class CarePlanDetailsComponent {

  @Input() patient: Patient | undefined;
  @Input() carePlan: CarePlan | undefined;

  get patientName(): string {
    return patientUtils.getPatientName(this.patient);
  }
}
