import { Component } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ObservationsService } from "../../../@core/services/observations.service";
import { NbDialogService, NbThemeService } from "@nebular/theme";
import { Observation } from "fhir/r5";
import { GlucoseLevelsLocale } from "./glucose-levels.locale";
import { PaginatedResult } from "../../../@core/models/paginatedResult";
import { ObservationFormComponent } from "./observation-form/observation-form.component";
import { getDateFromString } from "../../../@core/services/utils/utils";

@Component({
  selector: 'app-glucose-levels',
  templateUrl: './glucose-levels.component.html',
  styleUrls: ['./glucose-levels.component.scss']
})
export class GlucoseLevelsComponent {

  private readonly defaultLimit = 20;
  options: any = {};
  patientId: string | undefined;
  results: PaginatedResult<Observation> | undefined

  constructor(
    private observationsService: ObservationsService,
    private theme: NbThemeService,
    private route: ActivatedRoute,
    private dialogService: NbDialogService
  ) {
    this.route.params.subscribe(params => {
      this.patientId = params["patientId"];
      this.getObservations()
    });
  }

  nextObservations(lastCursor?: string): void {
    this.getObservations(this.defaultLimit, lastCursor);
  }

  openDialogForm(): void {
    const emptyObservation = this.observationsService.getEmptyGlucoseObservation(this.patientId ?? '');
    this.dialogService.open(ObservationFormComponent, {
      closeOnBackdropClick: false,
      context: {
        observation: emptyObservation,
        isUpdate: false
      }})
      .onClose.subscribe(saved => {
      if (saved) {
        this.getObservations();
      }
    });
  }

  private getObservations(limit: number = this.defaultLimit, lastCursor?: string): void {
    if (!this.patientId) {
      return;
    }

    this.observationsService.getObservations(this.patientId, limit, lastCursor)
      .subscribe(paginatedObservations => {
        this.results = paginatedObservations;
        this.theme.getJsTheme().subscribe(config => {
          const colors: any = config.variables;
          const echarts: any =  config.variables?.['echarts'];
          const data = paginatedObservations.results
            .sort((a, b) => (a.issued ?? 0) > (b.issued ?? 0) ? 1 : -1)
            .map(observation => this.getObservationDataForChart(observation))
          this.setOptions(colors, echarts, data.map(item => item.value), data.map(item => item.date))
        })
      });
  }

  private getObservationDataForChart = (observation: Observation): { value: number, date: string } => {
    const stringDate = getDateFromString(observation.issued);
    return {
      value: observation.valueQuantity!.value ?? 0,
      date: stringDate?.toLocaleDateString(GlucoseLevelsLocale.localeTime) ?? ''
    }
  };

  private setOptions(colors: any, echarts: any, values: number[], dates: string[]): void {
    this.options = {
      backgroundColor: echarts.bg,
      color: [colors.primary],
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c}',
      },
      legend: {
        left: 'left',
        data: [GlucoseLevelsLocale.tableLegend],
        textStyle: {
          color: echarts.textColor,
        },
      },
      xAxis: [
        {
          type: 'category',
          data: dates,
          axisTick: {
            alignWithLabel: true,
          },
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          axisLabel: {
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: echarts.axisLineColor,
            },
          },
          splitLine: {
            lineStyle: {
              color: echarts.splitLineColor,
            },
          },
          axisLabel: {
            formatter: '{value} mmol/l',
            textStyle: {
              color: echarts.textColor,
            },
          },
        },
      ],
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      series: [
        {
          name: GlucoseLevelsLocale.tableLegend,
          type: 'line',
          data: values,
        },
      ],
    };
  }
}
