import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NbActionsModule, NbButtonModule, NbContextMenuModule, NbIconModule,
  NbLayoutModule,
  NbMenuModule,
  NbSearchModule, NbSelectModule,
  NbSidebarModule, NbThemeModule,
  NbUserModule
} from "@nebular/theme";
import {NbSecurityModule} from "@nebular/security";
import {NbEvaIconsModule} from "@nebular/eva-icons";
import {OneColumnComponent} from "./layouts/one-column/one-column.component";
import {DEFAULT_THEME} from "./style/default";

const NB_MODULES = [
  NbLayoutModule,
  NbMenuModule,
  NbUserModule,
  NbActionsModule,
  NbSearchModule,
  NbSidebarModule,
  NbContextMenuModule,
  NbSecurityModule,
  NbButtonModule,
  NbSelectModule,
  NbIconModule,
  NbEvaIconsModule
]

const COMPONENTS = [
  OneColumnComponent
]

@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    ...NB_MODULES
  ],
  exports: [CommonModule, ...COMPONENTS]
})
export class ThemeModule {
  static forRoot(): ModuleWithProviders<ThemeModule> {
    return {
      ngModule: ThemeModule,
      providers: [
        ...NbThemeModule.forRoot(
          {
            name: 'default',
          },
          [ DEFAULT_THEME ],
        ).providers,
      ]
    }
  }
}
