import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { TimeOfDay } from "../../medication-request-form/form-data";
import { FormComponent } from "../../../../@core/components/form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observation } from "fhir/r4";
import { Extensions } from "../../../../@core/services/data/constants";
import { ObservationsService } from "../../../../@core/services/observations.service";
import { FormStatus } from "../../../../@core/services/data/form-data";
import * as utils from "../../../../@core/services/utils/utils";
import * as resourceUtils from "../../../../@core/services/utils/resource-utils";

@Component({
  selector: 'app-observation-form',
  templateUrl: './observation-form.component.html',
  styleUrls: ['./observation-form.component.scss']
})
export class ObservationFormComponent extends FormComponent implements OnInit {
  @Input() observation: Observation;
  @Input() isUpdate: boolean = false;
  timesOfDay = TimeOfDay;
  observationForm: FormGroup;
  saved: boolean = false;
  localeTime = 'dd/MM/yyyy HH:mm'
  showDeleteMessage: boolean = false;

  constructor(
    private dialogRef: NbDialogRef<ObservationFormComponent>,
    private formBuilder: FormBuilder,
    private observationService: ObservationsService
  ) {
    super();
  }

  ngOnInit() {
    const date = utils.getDateOrDefault(this.observation?.issued);
    this.observationForm = this.formBuilder.group({
      value: this.formBuilder.control(this.observation?.valueQuantity?.value, [Validators.required]),
      date: this.formBuilder.control(date, [Validators.required]),
      timing: this.formBuilder.control(resourceUtils.getCodeExtension(this.observation, Extensions.RESOURCE_TIMING), [Validators.required])
    });
  }

  close(): void {
    this.dialogRef.close(this.saved);
  }

  get valueControl(): FormControl {
    return this.observationForm.get('value') as FormControl;
  }

  get dateControl(): FormControl {
    return this.observationForm.get('date') as FormControl;
  }

  get timingControl(): FormControl {
    return this.observationForm.get('timing') as FormControl;
  }

  submitForm(): void {
    this.observation.valueQuantity.value = this.valueControl.value;
    this.observation.issued = this.dateControl.value.toISOString();
    resourceUtils.setCodeExtension(this.observation, Extensions.RESOURCE_TIMING, this.timingControl.value);

    this.formStatus = FormStatus.loading;

    if (this.isUpdate) {
      this.observationService.updateObservation(this.observation)
        .subscribe(this.formSuccess, this.formError)
      return;
    }

    this.observationService.postObservation(this.observation)
      .subscribe(this.formSuccess, this.formError)
  }

  deleteRecord(): void {
    this.formStatus = FormStatus.loading;
    this.observationService.deleteObservation(this.observation.id)
      .subscribe(this.formSuccess, this.formError)
  }

  private formSuccess = () => {
    this.formStatus = FormStatus.success;
    this.saved = true;
  }

  private formError = (error) => {
    this.formStatus = FormStatus.error;
    console.log(error);
  }
}
