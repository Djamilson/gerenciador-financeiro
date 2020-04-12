import { GerenciarPermissoesComponent } from './gerenciar-permissoes/gerenciar-permissoes.component';
import { RecuperarSenhasComponent } from './recuperar-senhas/recuperar-senhas.component';
import { UsuarioCadastroComponent } from './usuario-cadastro/usuario-cadastro.component';
import { UsuariosPesquisaComponent } from './usuarios-pesquisa/usuarios-pesquisa.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthGuard } from './../seguranca/auth.guard';

const routes: Routes = [

  {
    path: 'recuperar-senhas',
    component: RecuperarSenhasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USUARIO_DEFAULT'] }
  },
  {
    path: 'recuperar-senhas/:token',
    component: RecuperarSenhasComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_USUARIO_DEFAULT'] }
  },
  {
    path: '',
    component: UsuariosPesquisaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_PESQUISAR_USUARIO'] }
  },
  {
    path: 'novo',
    component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  },
  {
    path: 'gerenciar',
    component: GerenciarPermissoesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  }, /*
  {
    path: 'novo_grupo',
    component: GrupoCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  },*/

  /*
  {
    path: 'nova_permissao',
    component: UsuariosPesquisaPermissaoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO_PERMISSAO'] }
  },*/
  /*
  {
    path: 'adicionar_permissao',
    component: UsuarioAdicionaPermissaoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO_PERMISSAO'] }
  },*/
  {
    path: ':codigo',
    component: UsuarioCadastroComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_CADASTRAR_USUARIO'] }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
