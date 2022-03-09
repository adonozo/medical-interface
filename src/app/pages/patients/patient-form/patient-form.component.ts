import { Component } from '@angular/core';
import { Location } from "@angular/common";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FormComponent } from "../../../@core/components/form.component";
import { Patient } from "../../../@core/models/patient";
import { PatientsService } from "../../../@core/services/patients.service";
import { FormStatus } from "../../../@core/services/data/form-data";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-patient-form',
  templateUrl: './patient-form.component.html',
  styleUrls: ['./patient-form.component.scss']
})
export class PatientFormComponent extends FormComponent {

  patientForm: FormGroup;
  readonly defaultDate: Date = new Date('2000-01-01');

  constructor(
    private patientsService: PatientsService ,
    private location: Location,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super();
    this.patientForm = formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      birthDate: [this.defaultDate, [Validators.required]],
      phoneContacts: formBuilder.array([])
    });
    this.addPhoneControlGroup();
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
    this.phonesArrayControl.push(this.formBuilder.group({
      number: ['', Validators.required],
      use: ['', [Validators.required, Validators.pattern('(home|work|temp|old|mobile)')]]
    }));

  public removeFromPhoneArray = (index: number): void =>
    this.phonesArrayControl.removeAt(index);

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    const patient: Patient = {
      id: '',
      alexaUserId: '',
      firstName: this.firstNameControl.value,
      lastName: this.lastNameControl.value,
      email: this.emailControl.value,
      gender: this.genderControl.value,
      birthDate: this.birthDateControl.value,
      phoneContacts: this.phonesArrayControl.controls.map(control => {
        return {
          number: control.get('number').value,
          use: control.get('use').value
        }
      })
    };

    this.formStatus = FormStatus.loading;
    this.patientsService.createPatient(patient)
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
