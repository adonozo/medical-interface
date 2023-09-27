import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { Observation } from "fhir/r4";
import { dateToString, getDateFromString, timingToString } from "../../../../@core/services/utils/utils";
import { getDisplayValue } from "../../../../@core/services/utils/observation-utils";
import { NbDialogService } from "@nebular/theme";
import { ObservationFormComponent } from "../observation-form/observation-form.component";

@Component({
  selector: 'app-observations-table',
  templateUrl: './observations-table.component.html',
  styleUrls: ['./observations-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ObservationsTableComponent implements OnChanges {
  @Input() observations: Observation[];
  @Output() onEdited: EventEmitter<void> = new EventEmitter<void>()

  data: ObservationTable[];

  constructor(private dialogService: NbDialogService) { }

  ngOnChanges(): void {
    this.data = this.observations?.map(observation => {
      const time = observation.extension ? timingToString(observation.extension[0].valueCode) : 'EXACT';

      return {
        id: observation.id,
        level: getDisplayValue(observation),
        date: dateToString(getDateFromString(observation.issued)),
        timing: time === 'EXACT' ? '-' : time
      }
    }) ?? [];
  }

  openEditDialog(id: string): void {
    const observation = this.observations.find(obs => obs.id === id);

    this.dialogService.open(ObservationFormComponent, {
      closeOnBackdropClick: false,
      context: {
        observation,
        isUpdate: true
      }})
      .onClose.subscribe(saved => {
      if (saved) {
        this.onEdited.emit();
      }
    });
  }
}

type ObservationTable = { id: string, level: string, date: string, timing: string };
