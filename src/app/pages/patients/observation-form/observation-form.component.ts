import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from "@nebular/theme";
import { TimeOfDay } from "../medication-request-form/form-data";
import { FormComponent } from "../../../@core/components/form.component";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Observation } from "fhir/r4";
import { ResourceUtils } from "../../../@core/services/utils/resourceUtils";
import { Extensions } from "../../../@core/services/data/constants";
import { getDateOrDefault } from "../../../@core/services/utils/utils";
import { ObservationsService } from "../../../@core/services/observations.service";
import { FormStatus } from "../../../@core/services/data/form-data";

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

  constructor(
    private dialogRef: NbDialogRef<ObservationFormComponent>,
    private formBuilder: FormBuilder,
    private observationService: ObservationsService
  ) {
    super();
  }

  ngOnInit() {
    const date = getDateOrDefault(this.observation?.effectiveDateTime);
    this.observationForm = this.formBuilder.group({
      value: this.formBuilder.control(this.observation?.valueQuantity?.value, [Validators.required]),
      date: this.formBuilder.control(date, [Validators.required]),
      timing: this.formBuilder.control(ResourceUtils.getCodeExtension(this.observation, Extensions.RESOURCE_TIMING), [Validators.required])
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
    this.observation.effectiveDateTime = this.dateControl.value.toISOString();
    ResourceUtils.setCodeExtension(this.observation, Extensions.RESOURCE_TIMING, this.timingControl.value);

    this.formStatus = FormStatus.loading;
    const subscribeNext = _ => {
      this.formStatus = FormStatus.success;
      this.saved = true;
    }
    const subscribeError = error => {
      console.log(error);
      this.formStatus = FormStatus.error;
    }

    if (this.isUpdate) {
      this.observationService.updateObservation(this.observation)
        .subscribe(subscribeNext, subscribeError)
      return;
    }

    this.observationService.postObservation(this.observation)
      .subscribe(subscribeNext, subscribeError)
  }
}
