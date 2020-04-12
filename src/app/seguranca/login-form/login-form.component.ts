import { RecuperarSenha } from './../../core/model';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../auth.service';

import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent implements OnInit {
  exbindoFormularioContato = false;

  loading = false;

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router
  ) {   }

   ngOnInit() {
    this.getParam();
   }

   getParam() {
    const params = new URLSearchParams(window.location.search);
    const someParam = params.get('someParam');

    console.log('someParam::Token::: ', someParam);
    return someParam;
  }

  login(usuario: string, senha: string) {
      this.loading = true;

      this.loga(usuario, senha);
  }

  private loga(usuario: string, senha: string) {
    this.auth.login(usuario, senha)
      .then(() => {
        this.router.navigate(['/dashboard']);
        this.loading = false;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });

  }

  prepararRecuperarSenha() {
    const dados = new RecuperarSenha();

    this.auth.login(dados.usuario, dados.senha)
      .then(() => {
        this.router.navigate(['/usuarios/recuperar-senhas']);
      })
      .catch(erro => {
        this.errorHandler.handle(erro);
      });

  }




}
