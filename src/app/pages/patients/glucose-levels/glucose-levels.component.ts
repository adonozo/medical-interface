import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ObservationsService } from "../../../@core/services/observations.service";
import { NbDialogService, NbThemeService } from "@nebular/theme";
import { LocalDataSource, Ng2SmartTableComponent } from "ng2-smart-table";
import { dateToString, getDateFromString, timingToString } from "../../../@core/services/utils/utils";
import { Observation } from "fhir/r4";
import { GlucoseLevelsLocale } from "./glucose-levels.locale";
import { PaginatedResult } from "../../../@core/models/paginatedResult";
import { ObservationFormComponent } from "./observation-form/observation-form.component";

@Component({
  selector: 'app-glucose-levels',
  templateUrl: './glucose-levels.component.html',
  styleUrls: ['./glucose-levels.component.scss']
})
export class GlucoseLevelsComponent implements AfterViewInit {

  private readonly defaultLimit = 20;
  options: any = {};
  patientId: string;
  results: PaginatedResult<Observation>
  @ViewChild('levelsTable') levelsTable: Ng2SmartTableComponent;

  settings = {
    selectedRowIndex: -1,
    columns: {
      level: {
        title: GlucoseLevelsLocale.columnLevel,
        filter: false,
        sort: false
      },
      date: {
        title: GlucoseLevelsLocale.columnDate,
        filter: false,
        sort: false
      },
      time: {
        title: GlucoseLevelsLocale.columnTime,
        filter: false,
        sort: false
      },
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
    },
    actions: {
      delete: false,
      edit: false,
      columnTitle: "Action",
      custom: [
        {
          name: 'edit',
          title: `<div class="badge d-table"><i class="fa-xs far fa-edit"></i> <span class="icon-text text-dark ml-1">Edit</span></div>`,
        }
      ]
    },
    mode: 'external',
    pager: {
      display: false
    }
  }
  source: LocalDataSource;

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

  ngAfterViewInit(): void {
    this.levelsTable.create.subscribe(_ =>
      this.openDialogForm(this.observationsService.getEmptyGlucoseObservation(this.patientId)));
  }

  nextObservations(lastCursor?: string): void {
    this.getObservations(this.defaultLimit, lastCursor);
  }

  handleCustomAction(event: any): void {
    if (event.action !== 'edit') {
      return;
    }

    const observation = {...event.data};
    delete observation.level;
    delete observation.date;
    delete observation.time;

    this.openDialogForm(observation, true);
  }

  private getObservations(limit: number = this.defaultLimit, lastCursor?: string): void {
    this.observationsService.getObservations(this.patientId, limit, lastCursor)
      .subscribe(paginatedObservations => {
        this.results = paginatedObservations;
        this.source = new LocalDataSource(paginatedObservations.results.map(observation => {
          const data: any = observation;
          const time = observation.extension ? timingToString(observation.extension[0].valueCode) : 'EXACT';
          const date = getDateFromString(observation.issued);
          data.level = `${observation.valueQuantity.value} ${observation.valueQuantity.unit}`;
          data.date = dateToString(date);
          data.time = time === 'EXACT' ? '-' : time;
          return data;
        }))
        this.theme.getJsTheme().subscribe(config => {
          const colors: any = config.variables;
          const echarts: any = config.variables.echarts;
          const data = paginatedObservations.results.map(observation => this.getObservationDataForChart(observation))
          this.setOptions(colors, echarts, data.map(item => item.value), data.map(item => item.date))
        })
      });
  }

  private openDialogForm(observation: Observation, isUpdate: boolean = false): void {
    this.dialogService.open(ObservationFormComponent, {
      closeOnBackdropClick: false,
      context: {
        observation,
        isUpdate
      }})
      .onClose.subscribe(saved => {
      if (saved) {
        this.getObservations();
      }
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
