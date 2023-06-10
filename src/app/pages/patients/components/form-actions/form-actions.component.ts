import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormStatus } from "../../../../@core/models/enums";
import { FormGroup } from "@angular/forms";

@Component({
  selector: 'app-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss']
})
export class FormActionsComponent {
  readonly formStatusType = FormStatus;
  @Input() formStatus: FormStatus;
  @Input() form: FormGroup;
  @Output() goBack: EventEmitter<void> = new EventEmitter<void>();
  @Output() submit: EventEmitter<void> = new EventEmitter<void>();

}
