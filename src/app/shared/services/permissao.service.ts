import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Permissao } from '../../core/model';
import { MoneyHttp } from '../../seguranca/money-http';

export class PermissaoFiltro {
  descricao: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {
 permissoesUrl: string;

  constructor(private http: MoneyHttp) {
    this.permissoesUrl = `${environment.apiUrl}/permissoes`;
  }

  pesquisar(filtro: PermissaoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.descricao) {
      params = params.append('nome', filtro.descricao);
    }

    return this.http.get<any>(`${this.permissoesUrl}`, { params })
      .toPromise()
      .then(response => {
        const permissoes = response.content;

        const resultado = {
          permissoes,
          total: response.totalElements
        };

        return resultado;
      });
  }


  adicionar(permissao: Permissao): Promise<Permissao> {
    return this.http.post<Permissao>(this.permissoesUrl, permissao)
      .toPromise();
  }

  atualizar(permissao: Permissao): Promise<Permissao> {
    return this.http.put<Permissao>(`${this.permissoesUrl}/${permissao.codigo}`, permissao)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Permissao> {
    return this.http.get<Permissao>(`${this.permissoesUrl}/${codigo}`)
      .toPromise();
  }

  listarPermissoes(): Promise<Permissao[]> {
    return this.http.get<Permissao[]>(this.permissoesUrl).toPromise();
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(this.permissoesUrl)
      .toPromise()
      .then(response => response.content);
  }
}
