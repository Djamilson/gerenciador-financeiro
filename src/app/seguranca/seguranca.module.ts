import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { FormsModule} from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JwtModule } from '@auth0/angular-jwt';

import { SharedModule } from './../shared/shared.module';
import { AuthGuard } from './auth.guard';
import { LogoutService } from './logout.service';
import { SegurancaRoutingModule } from './seguranca-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { environment } from '../../environments/environment';

// Import library module
import { NgxSpinnerModule } from 'ngx-spinner';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    SharedModule,

    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      }
    }),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),

    NgxSpinnerModule,
    SegurancaRoutingModule
  ],
  declarations: [LoginFormComponent],
  providers: [
    AuthGuard,
    LogoutService
  ]
})
export class SegurancaModule { }


export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
