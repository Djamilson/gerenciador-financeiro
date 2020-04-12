import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Title } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { NgModule, LOCALE_ID } from '@angular/core';

import localePt from '@angular/common/locales/pt';

import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { GrowlModule } from 'primeng/growl';
import { JwtHelperService } from '@auth0/angular-jwt';

import { environment } from './../../environments/environment';
import { NavbarComponent } from './navbar/navbar.component';
import { NaoAutorizadoComponent } from './nao-autorizado.component';
import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada.component';

registerLocaleData(localePt);

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,

    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),


   NgbModule.forRoot(),

    GrowlModule,
    ConfirmDialogModule,
  ],
  declarations: [
    NavbarComponent,
    PaginaNaoEncontradaComponent,
    NaoAutorizadoComponent
  ],
  exports: [
    NgbModule,

    NavbarComponent,
    GrowlModule,
    ConfirmDialogModule

  ],
  providers: [
    ConfirmationService,
    MessageService,
    JwtHelperService,
    Title,
    { provide: LOCALE_ID, useValue: 'pt' }
  ]
})
export class CoreModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
