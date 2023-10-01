import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Patient } from "fhir/r4";
import { InternalPatient } from "../../../../@core/models/internalPatient";
import { toInternalPatient } from "../../../../@core/services/utils/patient-utils";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-patients-table',
  templateUrl: './patients-table.component.html',
  styleUrls: ['./patients-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatientsTableComponent implements OnInit {
  @Input() patients : Patient[] = []
  displayPatients: InternalPatient[] = []

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.displayPatients = this.patients.map(patient => toInternalPatient(patient))
  }

  async viewPatient(patientId: string): Promise<void> {
    await this.router.navigate([patientId + '/view'], {relativeTo: this.activatedRoute.parent});
  }
}
