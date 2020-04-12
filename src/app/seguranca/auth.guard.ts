import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';

import { AuthService } from './auth.service';
import { RecuperarSenha } from '../core/model';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

      if (this.auth.isAccessTokenInvalido()) {
      console.log('Navegação com access token inválido. Obtendo novo token...');

      return this.auth.obterNovoAccessToken()
        .then(() => {
          if (this.auth.isAccessTokenInvalido()) {

              for (const role of next.data.roles) {
                if (role === 'ROLE_USUARIO_DEFAULT') {
                  this.prepararRecuperarSenha();

                  return true;

                }
              }

              this.router.navigate(['/login']);

            return false;
          }

          return true;
        });
    } else if (next.data.roles && !this.auth.temQualquerPermissao(next.data.roles)) {

      console.log(next.data.roles);

      this.router.navigate(['/nao-autorizado']);
      return false;
    }

    return true;
  }

  prepararRecuperarSenha() {
    const dados = new RecuperarSenha();

    this.auth.login(dados.usuario, dados.senha)
      .then(() => {
      //    this.router.navigate(['/usuarios/recuperar-senhas']);
      })
      .catch(erro => {
        // this.errorHandler.handle(erro);
      });

  }


}
