import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TableModule } from 'primeng/table';
import { environment } from './../../environments/environment.prod';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { NgModule } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

import { PanelModule } from 'primeng/panel';
import { ChartModule } from 'primeng/chart';

import { SharedModule } from './../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RelatorioReceitaSemanaComponent } from './relatorio-receita-semana/relatorio-receita-semana.component';
import { RelatorioDespesaSemanaComponent } from './relatorio-despesa-semana/relatorio-despesa-semana.component';



@NgModule({
  imports: [
    CommonModule,

    PanelModule,
    ChartModule,

    ButtonModule,
    TableModule,
     TooltipModule,
    CalendarModule,
    SelectButtonModule,
    DropdownModule,
    CurrencyMaskModule,
     ProgressSpinnerModule,


     PanelModule,

     SplitButtonModule,

    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),

    SharedModule,
    DashboardRoutingModule
  ],
  declarations: [DashboardComponent, RelatorioReceitaSemanaComponent, RelatorioDespesaSemanaComponent],
  providers: [ DecimalPipe ]
})
export class DashboardModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/dashboard`,
    '.json'
  );
}
