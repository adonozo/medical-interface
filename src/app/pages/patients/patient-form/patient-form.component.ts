import { Component } from '@angular/core';
import { formatDate, Location } from "@angular/common";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FormComponent } from "../../../@core/components/form.component";
import { InternalPatient } from "../../../@core/models/internalPatient";
import { PatientsService } from "../../../@core/services/patients.service";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientFormService } from "./patient-form.service";
import { flatMap } from "rxjs/internal/operators";
import * as patientUtils from "../../../@core/services/utils/patient-utils";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent extends FormComponent {

  patientForm: FormGroup;
  isEditForm: boolean;
  private patientId: string = '';

  constructor(
    private patientsService: PatientsService,
    private patientsFormService: PatientFormService,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.route.params
      .pipe(
        flatMap(params => {
          if (params['patientId']) {
            this.patientId = params['patientId'];
            this.isEditForm = true;
            return patientsFormService.getPatientForm(params['patientId']);
          }

          return patientsFormService.getDefaultForm();
        }))
      .subscribe(form => this.patientForm = form);
  }

  get firstNameControl(): FormControl {
    return this.patientForm.get('firstName') as FormControl;
  }

  get lastNameControl(): FormControl {
    return this.patientForm.get('lastName') as FormControl;
  }

  get emailControl(): FormControl {
    return this.patientForm.get('email') as FormControl;
  }

  get genderControl(): FormControl {
    return this.patientForm.get('gender') as FormControl;
  }

  get birthDateControl(): FormControl {
    return this.patientForm.get('birthDate') as FormControl;
  }

  get phonesArrayControl(): FormArray {
    return this.patientForm.get('phoneContacts') as FormArray;
  }

  addPhoneControlGroup = (): void =>
    this.phonesArrayControl.push(this.patientsFormService.getEmptyPhoneContactForm());

  removeFromPhoneArray = (index: number): void =>
    this.phonesArrayControl.removeAt(index);

  goBack(): void {
    this.location.back();
  }

  submitForm(): void {
    const patient: InternalPatient = {
      id: this.patientId,
      alexaUserId: '',
      firstName: this.firstNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value,
      gender: this.genderControl.value,
      birthDate: this.birthDateControl.value,
      phones: this.phonesArrayControl.controls.map(PatientFormService.getPhoneContactValues)
    };

    this.formStatus = FormStatus.loading;
    this.savePatient(patient);
  }

  private savePatient(internalPatient: InternalPatient): void {
    const birthDate = formatDate(internalPatient.birthDate, 'yyyy-MM-dd', 'en_US');
    const patient = patientUtils.toPatient(internalPatient, birthDate);
    const method = this.isEditForm ? this.patientsService.patchPatient(internalPatient)
      : this.patientsService.createPatient(patient);
    method.subscribe(
      _ => this.formStatus = FormStatus.success,
      error => {
        this.formStatus = FormStatus.error;
        console.log(error);
      }
    )
  }
}
