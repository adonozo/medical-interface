import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { FormComponent } from "../../../@core/components/form.component";
import { Patient } from "../../../@core/models/patient";
import { PatientsService } from "../../../@core/services/patients.service";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ActivatedRoute, Router } from "@angular/router";
import { PatientFormService } from "./patient-form.service";
import { flatMap } from "rxjs/internal/operators";

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
    private route: ActivatedRoute,
    private activatedRoute: ActivatedRoute,
  ) {
    super();
    this.route.params.pipe(
      flatMap(params => {
        if (params['patientId']) {
          this.patientId = params['patientId'];
          this.isEditForm = true;
          return patientsFormService.getPatientForm(params['patientId']);
        }

        return patientsFormService.getDefaultForm();
      })
    ).subscribe(form => this.patientForm = form);
  }

  public get firstNameControl(): FormControl {
    return this.patientForm.get('firstName') as FormControl;
  }

  public get lastNameControl(): FormControl {
    return this.patientForm.get('lastName') as FormControl;
  }

  public get emailControl(): FormControl {
    return this.patientForm.get('email') as FormControl;
  }

  public get genderControl(): FormControl {
    return this.patientForm.get('gender') as FormControl;
  }

  public get birthDateControl(): FormControl {
    return this.patientForm.get('birthDate') as FormControl;
  }

  public get phonesArrayControl(): FormArray {
    return this.patientForm.get('phoneContacts') as FormArray;
  }

  public addPhoneControlGroup = () : void =>
    this.phonesArrayControl.push(this.patientsFormService.getEmptyPhoneContactForm());

  public removeFromPhoneArray = (index: number): void =>
    this.phonesArrayControl.removeAt(index);

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    const patient: Patient = {
      id: this.patientId,
      alexaUserId: '',
      firstName: this.firstNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value,
      gender: this.genderControl.value,
      birthDate: this.birthDateControl.value,
      phoneContacts: this.phonesArrayControl.controls.map(PatientFormService.getPhoneContactValues)
    };

    this.formStatus = FormStatus.loading;
    this.savePatient(patient);
  }

  private savePatient(patient: Patient): void {
    const method = this.isEditForm ? this.patientsService.updatePatient(patient)
      : this.patientsService.createPatient(patient);
    method
      .subscribe(
        async patient => {
          await this.router.navigate([patient.id + '/view'], {relativeTo: this.activatedRoute.parent});
        },
        error => {
          this.formStatus = FormStatus.error;
          console.log(error);
        }
      )
  }
}
