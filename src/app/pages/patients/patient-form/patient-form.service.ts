import { Injectable } from '@angular/core';
import { PatientsService } from "../../../@core/services/patients.service";
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { PatientPhoneContact } from "../../../@core/models/internalPatient";
import { map, Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PatientFormService {
  readonly defaultDate: Date = new Date('2000-01-01');

  constructor(private patientsService: PatientsService,
              private formBuilder: FormBuilder) {
  }

  getPatientForm(patientId: string): Observable<FormGroup> {
    return this.patientsService.getInternalPatient(patientId)
      .pipe(
        map(patient => {
          const phoneContactsForm = this.getPhoneContactsForm(patient.phones);
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

  getDefaultForm(): Observable<FormGroup> {
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

  getEmptyPhoneContactForm(): FormGroup {
    return this.formBuilder.group({
      value: ['', Validators.required],
      use: ['', [Validators.required, Validators.pattern('(home|work|temp|old|mobile)')]]
    })
  }

  static getPhoneContactValues(formControl: AbstractControl, index: number): PatientPhoneContact {
    return {
      system: 'phone',
      value: formControl.get('value')?.value,
      use: formControl.get('use')?.value,
      rank: index
    }
  }

  private getPhoneContactsForm(phoneContacts: PatientPhoneContact[]): FormArray {
    const form: FormArray = this.formBuilder.array([]);
    if (!phoneContacts || phoneContacts.length === 0) {
      form.push(this.getEmptyPhoneContactForm());
      return form;
    }

    phoneContacts.forEach(contact => {
      form.push(this.formBuilder.group({
        value: [contact.value, Validators.required],
        use: [contact.use, [Validators.required, Validators.pattern('(home|work|temp|old|mobile)')]]
      }));
    });

    return form;
  }
}
