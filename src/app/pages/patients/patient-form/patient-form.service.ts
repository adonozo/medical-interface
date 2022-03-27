import { Injectable } from '@angular/core';
import { PatientsService } from "../../../@core/services/patients.service";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientPhoneContact } from "../../../@core/models/patient";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PatientFormService {
  readonly defaultDate: Date = new Date('2000-01-01');

  constructor(private patientsService: PatientsService,
              private formBuilder: FormBuilder) {
  }

  public getPatientForm(patientId): Observable<FormGroup> {
    return this.patientsService.getSinglePatient(patientId)
      .pipe(
        map(patient => {
          const phoneContactsForm = this.getPhoneContactsForm(patient.phoneContacts);
          return this.formBuilder.group({
            firstName: [patient.firstName, Validators.required],
            lastName: [patient.lastName, Validators.required],
            email: [patient.email, [Validators.required, Validators.email]],
            gender: [patient.gender, Validators.required],
            birthDate: [patient.birthDate, [Validators.required]],
            phoneContacts: phoneContactsForm
          });
        })
      )
  }

  public getDefaultForm(): Observable<FormGroup> {
    const form = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      birthDate: [this.defaultDate, [Validators.required]],
      phoneContacts: this.formBuilder.array([this.getEmptyPhoneContactForm()])
    });
    return of(form);
  }

  public getEmptyPhoneContactForm(): FormGroup {
    return this.formBuilder.group({
      number: ['', Validators.required],
      use: ['', [Validators.required, Validators.pattern('(home|work|temp|old|mobile)')]]
    })
  }

  public static getPhoneContactValues(formControl: AbstractControl): PatientPhoneContact {
    return {
      number: formControl.get('number').value,
      use: formControl.get('use').value
    }
  }

  private getPhoneContactsForm(phoneContacts: PatientPhoneContact[]): FormArray {
    const form = this.formBuilder.array([]);
    if (!phoneContacts || phoneContacts.length === 0) {
      form.push(this.getEmptyPhoneContactForm());
      return form;
    }

    phoneContacts.forEach(contact => {
      form.push(this.formBuilder.group({
        number: [contact.number, Validators.required],
        use: [contact.use, [Validators.required, Validators.pattern('(home|work|temp|old|mobile)')]]
      }));
    });
    return form;
  }
}
