import { Component } from '@angular/core';
import { PatientsService } from "../../../@core/services/patients.service";
import { ActivatedRoute } from "@angular/router";
import { ObservationsService } from "../../../@core/services/observations.service";
import { NbThemeService } from "@nebular/theme";
import { LocalDataSource } from "ng2-smart-table";
import { timingToString } from "../../../@core/services/utils/utils";
import { Observation } from "fhir/r4";
import { GlucoseLevelsLocale } from "./glucose-levels.locale";

@Component({
  selector: 'app-glucose-levels',
  templateUrl: './glucose-levels.component.html',
  styleUrls: ['./glucose-levels.component.scss']
})
export class GlucoseLevelsComponent {

  options: any = {};
  patientId: string;

  settings = {
    columns: {
      level: {
        title: GlucoseLevelsLocale.columnLevel,
        type: 'string'
      },
      date: {
        title: GlucoseLevelsLocale.columnDate,
        type: 'string',
        sortDirection: 'desc'
      },
      time: {
        title: GlucoseLevelsLocale.columnTime,
        type: 'string'
      },
    },
    actions: false
  }
  source: LocalDataSource;

  constructor(
    private patientService: PatientsService,
    private observationsService: ObservationsService,
    private theme: NbThemeService,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.patientId = params["patientId"];
      this.getObservations()
    });
  }

  private getObservations(): void {
    this.observationsService.getObservations(this.patientId)
      .subscribe(observations => {
        this.source = new LocalDataSource(observations.map(observation => {
          const data: any = observation;
          const time = observation.extension ? timingToString(observation.extension[0].valueCode) : 'EXACT';
          const date = new Date(observation.issued).toLocaleString(GlucoseLevelsLocale.localeTime);
          data.level = `${observation.valueQuantity.value} ${observation.valueQuantity.unit}`;
          data.date = date.substring(0, date.length - 3);
          data.time = time === 'EXACT' ? '-' : time;
          return data;
        }))
        this.theme.getJsTheme().subscribe(config => {
          const colors: any = config.variables;
          const echarts: any = config.variables.echarts;
          const data = observations.map(observation => this.getObservationDataForChart(observation))
          this.setOptions(colors, echarts, data.map(item => item.value), data.map(item => item.date))
        })
      });
  }

  private getObservationDataForChart = (observation: Observation): { value: number, date: string } => {
    return {
      value: observation.valueQuantity.value,
      date: new Date(observation.issued).toLocaleDateString(GlucoseLevelsLocale.localeTime)
    }
  };

  private setOptions(colors, echarts, values: number[], dates: string[]): void {
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
