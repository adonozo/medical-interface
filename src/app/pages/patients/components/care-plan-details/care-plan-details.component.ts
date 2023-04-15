import { Component, Input } from '@angular/core';
import { CarePlan, Patient } from "fhir/r4";
import { ResourceUtils } from "../../../../@core/services/utils/resourceUtils";

@Component({
  selector: 'app-care-plan-details',
  templateUrl: './care-plan-details.component.html',
  styleUrls: ['./care-plan-details.component.scss']
})
export class CarePlanDetailsComponent {

  @Input() patient: Patient;
  @Input() carePlan: CarePlan;

  get patientName(): string {
    return ResourceUtils.getPatientName(this.patient);
  }
}
