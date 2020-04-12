import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { LoginFormComponent } from './login-form/login-form.component';

const routes: Routes = [
  { path: 'login', component: LoginFormComponent}/*,
  { path: ':token', component: RecuperarSenhaComponent, canActivate: [AuthGuard],
  data: { valor: 'RECUPERAR_SENHA'}}*/,
 /* { path: 'recuperar-senha', component: RecuperarSenhaComponent,
  data: { valor: 'RECUPERAR_SENHA'}}
  ,
  { path: 'recuperar-informacoes', component: RecuperarInformacoesComponent,
  data: { valor: 'RECUPERAR_SENHA'}}
*/

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SegurancaRoutingModule { }
