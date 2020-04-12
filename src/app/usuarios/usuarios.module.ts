import { NgModule } from '@angular/core';

import { SharedModule } from './../shared/shared.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { RecuperarSenhasComponent } from './recuperar-senhas/recuperar-senhas.component';
import { GerenciarPermissoesComponent } from './gerenciar-permissoes/gerenciar-permissoes.component';

@NgModule({
  imports: [
    SharedModule,
    UsuariosRoutingModule
  ],
  declarations: [
     UsuariosPesquisaComponent,
     UsuarioCadastroComponent,
     RecuperarSenhasComponent,
     GerenciarPermissoesComponent
    ]
})
export class UsuariosModule { }
