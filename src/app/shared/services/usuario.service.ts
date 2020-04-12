import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';


import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Usuario } from '../../core/model';
import { MoneyHttp } from '../../seguranca/money-http';
import { VeririfcationToken } from '../../core/model';

export class UsuarioFiltro {
  nome: string;
  email: string;
  dataNascimento: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  usuariosUrl: string;

  constructor(private http: MoneyHttp) {
    this.usuariosUrl = `${environment.apiUrl}/usuarios`;
  }

  pesquisar(filtro: UsuarioFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http
      .get<any>(`${this.usuariosUrl}`, { params })
      .toPromise()
      .then(response => {
        const usuarios = response.content;

        const resultado = {
          usuarios,
          total: response.totalElements
        };

        console.log('>>>= ', resultado.usuarios);
        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http
      .get<any>(this.usuariosUrl)
      .toPromise()
      .then(response => response.content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http
      .delete(`${this.usuariosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders().append('Content-Type', 'application/json');

    return this.http
      .put(`${this.usuariosUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(usuario: Usuario): Promise<Usuario> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    return this.http.post<Usuario>(this.usuariosUrl, usuario).toPromise();
  }

  recuperarSenha(usuario: string, data: string): Promise<any> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    console.log('Service', headers);
    return this.http
      .get<any>(
        `${this.usuariosUrl}/recuperar-senha?usuario=${usuario}&data=${data}`,
        { headers }
      )
      .toPromise()
      .then(response => {

        const resultado = {
          response
        };

        return resultado;
      });
  }

  verificaTokenValido(token: string): Promise<any> {
      const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    let params = new HttpParams();

    if (token) {
      params = params.append('token', token);
    }

    return this.http
      .get<any>(`${this.usuariosUrl}/verificaTokenValido?token=${token}`, { headers })
      .toPromise()
      .then(response => {
        const verificaToken = response;
        return verificaToken;
      });
  }

  atualizar(usuario: Usuario): Promise<Usuario> {
    return this.http
      .put<Usuario>(`${this.usuariosUrl}/${usuario.codigo}`, usuario)
      .toPromise();
  }


  atualizarSenha(codigo_usuario: number, senha: {}): Promise<VeririfcationToken> {
    const headers = new HttpHeaders().append(
      'Content-Type',
      'application/json'
    );

    const params = new HttpParams();

    return this.http
      .put<VeririfcationToken>(`${this.usuariosUrl}/atualizandoUsuario?codigo_usuario=${codigo_usuario}&senha=${senha}`, {params})
      .toPromise();
  }


  buscarPorCodigo(codigo: number): Promise<Usuario> {
    return this.http.get<Usuario>(`${this.usuariosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const usuario = response;
        this.converterStringsParaDatas([usuario]);

        return usuario;
      });
  }

  private converterStringsParaDatas(usuarios: Usuario[]) {
    for (const usuario of usuarios) {
      usuario.dataNascimento = moment(usuario.dataNascimento,
        'YYYY-MM-DD').toDate();
    }
  }

 isEmpty(obj: any): boolean {
    if (obj === null
        || obj === undefined
        || (obj.length !== undefined && obj.length === 0)
        || Object.keys(obj).length === 0) {
        return true;
    }

    return false;
}

  verificarEmail(email: string): Promise<any> {
    const headers = new HttpHeaders().append(
    'Content-Type',
    'application/json'
  );

  let params = new HttpParams();

  if (email) {
    params = params.append('email', email);
  }

  return this.http
    .get<any>(`${this.usuariosUrl}/verificarEmail?email=${email}`, { headers })
    .toPromise()
    .then(response => {
      console.log('=======================>>>: ', response);
      return response;
    });
}


}
