import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { LogoutService } from './../../seguranca/logout.service';
import { ErrorHandlerService } from './../error-handler.service';
import { AuthService } from './../../seguranca/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  exibindoMenu = false;
  logo = require('./../../../assets/logo.png');

  navigation = [
    { link: 'dashboard', label: 'anms.menu.dashboard', permissao: 'ROLE_PESQUISAR_LANCAMENTO'},
    { link: 'lancamentos', label: 'anms.menu.lancamentos', permissao: 'ROLE_PESQUISAR_LANCAMENTO' },
    { link: 'pessoas', label: 'anms.menu.pessoas', permissao: 'ROLE_PESQUISAR_PESSOA' },
    { link: 'categorias', label: 'anms.menu.categorias', permissao: 'ROLE_PESQUISAR_CATEGORIA' },
    { link: 'relatorios/lancamentos', label: 'anms.menu.relatorios', permissao: 'ROLE_PESQUISAR_LANCAMENTO'},
    { link: 'usuarios', label: 'anms.menu.seguranca', permissao: 'ROLE_PESQUISAR_USUARIO'}
  ];

  navigationSideMenu = [
    ...this.navigation,
    { link: 'settings', label: 'anms.menu.settings', permissao: '' }
  ];

  collapsed = true;
  toggleCollapsed(): void {
    this.collapsed = !this.collapsed;
  }

  constructor(
    public auth: AuthService,
    private logoutService: LogoutService,
    private errorHandler: ErrorHandlerService,
    private router: Router
      ) { }

  ngOnInit() {
  }

  logout() {
    this.logoutService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
