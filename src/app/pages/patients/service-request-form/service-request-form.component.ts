import { Component, OnInit } from '@angular/core';
import {Patient} from "../../../@core/models/patient";
import {flatMap} from "rxjs/internal/operators";
import {PatientsService} from "../../../@core/services/patients.service";
import {ActivatedRoute} from "@angular/router";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Location} from "@angular/common";
import {DurationFormData, FormStatus} from "../../../@core/services/data/form-data";

@Component({
  selector: 'app-service-request-form',
  templateUrl: './service-request-form.component.html',
  styleUrls: ['./service-request-form.component.scss']
})
export class ServiceRequestFormComponent implements OnInit {

  patient: Patient;
  serviceForm: FormGroup;
  formStatus: FormStatus = FormStatus.default;
  formStatusType = FormStatus;
  durationType = DurationFormData;
  durationSelected: DurationFormData;

  constructor(
    private patientService: PatientsService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private location: Location
  ) {
    this.route.params.pipe(
      flatMap(params => patientService.getSinglePatient(params["patientId"]))
    ).subscribe(patient => this.patient = patient);
    this.serviceForm = formBuilder.group({
      instructions: [''],
      durationQuantity: [],
      durationUnit: ['d'],
      periodRange: [],
      periodStart: []
    });
  }

  ngOnInit(): void {
  }

  public get durationQuantityControl(): FormControl {
    return this.serviceForm.get('durationQuantity') as FormControl;
  }

  public get durationUnitControl(): FormControl {
    return this.serviceForm.get('durationUnit') as FormControl;
  }

  public get periodRangeControl(): FormControl {
    return this.serviceForm.get('periodRange') as FormControl;
  }

  public get periodStartControl(): FormControl {
    return this.serviceForm.get('periodStart') as FormControl;
  }

  public get instructionsControl(): FormControl {
    return this.serviceForm.get('instructions') as FormControl;
  }

  public goBack(): void {
    this.location.back();
  }

  public submitForm(): void {
    console.log(this.serviceForm.value);
  }
}
