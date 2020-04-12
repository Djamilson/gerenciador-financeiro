import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { NotAuthenticatedError } from './../seguranca/money-http';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private messageService: MessageService, private router: Router) {}

  handle(errorResponse: any) {
    let msg: string;
    let objetoJaEstaCadastrado: string;

    if (typeof errorResponse === 'string') {
      msg = errorResponse;
    } else if (errorResponse instanceof NotAuthenticatedError) {
      msg = 'Sua sessão expirou!';
      this.router.navigate(['/login']);
    } else if (errorResponse instanceof HttpErrorResponse &&
      errorResponse.status === 0) {
        msg = 'O servidor de dados não foi inicializado, não foi possível conecta, contacte o Administrador para inicializar!';
     } else if (
      errorResponse instanceof HttpErrorResponse &&
      errorResponse.status >= 400 &&
      errorResponse.status <= 499
    ) {
      msg = 'Ocorreu um erro ao processar a sua solicitação';

      if (errorResponse.status === 405) {
        objetoJaEstaCadastrado = ', esse nome já existe na base de dados!';
      }

      if (errorResponse.status === 403) {
        msg = 'Você não tem permissão para executar esta ação';
      }

      try {
        const jaExisteNoBanco = errorResponse.error[0].mensagemDesenvolvedor;
        const resultado = jaExisteNoBanco.substring(
          0,
          jaExisteNoBanco.indexOf(':')
        );

        if (resultado === 'MySQLIntegrityConstraintViolationException') {
          objetoJaEstaCadastrado = ', já existe na base de dados!';
        }

        msg = errorResponse.error[0].mensagemUsuario;
      } catch (e) {}

      console.error('Ocorreu um erro', errorResponse);
    } else if (
      errorResponse instanceof HttpErrorResponse &&
      errorResponse.status === 500
    ) {
      const naoExisteNoBanco = errorResponse.error.message;

      const path = errorResponse.error.path;

      if (
        naoExisteNoBanco === 'No value present' &&
        path === '/usuarios/recuperar-senha'
      ) {
        msg = 'Usuário não encontrado no banco de Dados! Tente novamene!';
      } else if (
        naoExisteNoBanco === 'No value present' &&
        errorResponse.error.path === '/usuarios/verificaTokenValido'
      ) {
        msg = 'Token expirando! Faça uma nova solicitação!';
        this.router.navigate(['/usuarios/recuperar-senhas']);
      }
    } else {
      msg = 'Erro ao processar serviço remoto. Tente novamente.';
      console.error('Ocorreu um erro', errorResponse);
    }

    if (objetoJaEstaCadastrado !== undefined) {
      this.messageService.add({
        severity: 'error',
        detail: msg.concat(objetoJaEstaCadastrado)
      });
    } else {
      this.messageService.add({ severity: 'error', detail: msg });
    }
  }
}
