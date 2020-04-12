import { ToolbarModule } from 'primeng/components/toolbar/toolbar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { FileUploadModule } from 'primeng/fileupload';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DialogModule } from 'primeng/dialog';
import { InputMaskModule } from 'primeng/inputmask';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { environment } from './../../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { PanelModule } from 'primeng/panel';
import { ErrorMsgComponent } from './error-msg/error-msg.component';
import { CampoControlErroComponent } from './campo-control-erro/campo-control-erro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToggleButtonModule} from 'primeng/togglebutton';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MessageComponent } from './message/message.component';
import { InputFieldComponent } from './input-field/input-field.component';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import {CardModule} from 'primeng/card';

import { BaseFormComponent } from './base-form/base-form.component';
import { FormDebugComponent } from './form-debug/form-debug.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,


    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    DialogModule,
    SelectButtonModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    CurrencyMaskModule,
    FileUploadModule,
    ProgressSpinnerModule,
    ToolbarModule,
    ToggleButtonModule,

    CardModule,

    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  }),


  ],

  declarations: [MessageComponent, InputFieldComponent, CampoControlErroComponent, ErrorMsgComponent, FormDebugComponent],
  exports: [MessageComponent, InputFieldComponent,

    CommonModule,
    HttpClientModule,

    FormDebugComponent,

    FormsModule,
    ReactiveFormsModule,
    PanelModule,
    DropdownModule,
    ButtonModule,
    TableModule,
    TooltipModule,
    InputMaskModule,
    DialogModule,
    SelectButtonModule,
    CalendarModule,
    InputTextModule,
    InputTextareaModule,
    CurrencyMaskModule,
    FileUploadModule,
    ProgressSpinnerModule,
    CardModule,
    TranslateModule,
    ToolbarModule,
    ToggleButtonModule,

    CampoControlErroComponent,
    ErrorMsgComponent,
  ],
  providers: [ ]

})
export class SharedModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(
    http,
    `${environment.i18nPrefix}/assets/i18n/`,
    '.json'
  );
}
