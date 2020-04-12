import { JwtHttpInterceptor } from './seguranca/jwt-http-interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SegurancaModule } from './seguranca/seguranca.module';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
   ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CoreModule,

    SegurancaModule,
    AppRoutingModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: JwtHttpInterceptor, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
