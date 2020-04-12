import { environment } from './../../environments/environment';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgModule } from '@angular/core';

import { LancamentosRoutingModule } from './lancamentos-routing.module';
import { SharedModule } from './../shared/shared.module';
import { LancamentosPesquisaComponent } from './lancamentos-pesquisa/lancamentos-pesquisa.component';
import { LancamentoCadastroComponent } from './lancamento-cadastro/lancamento-cadastro.component';
import { LancamentosReceitasComponent } from './lancamentos-receitas/lancamentos-receitas.component';
import { LancamentosDespesasComponent } from './lancamentos-despesas/lancamentos-despesas.component';
import { DataTableComponent } from './componentes/data-table/data-table.component';


@NgModule({
  imports: [
    SharedModule,
    LancamentosRoutingModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })

  ],
  declarations: [
    LancamentoCadastroComponent,
    LancamentosPesquisaComponent,
    LancamentosReceitasComponent,
    LancamentosDespesasComponent,
    DataTableComponent
  ],
  exports: []
})
export class LancamentosModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
