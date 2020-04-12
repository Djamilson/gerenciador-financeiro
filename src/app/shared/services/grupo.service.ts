import { GrupoSemPermissao, Permissao } from './../../core/model';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';

import { environment } from '../../../environments/environment';
import { Grupo } from '../../core/model';
import { MoneyHttp } from '../../seguranca/money-http';

export class GrupoFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  gruposUrl: string;
  permissoesUrl: string;
  constructor(private http: MoneyHttp) {
    this.gruposUrl = `${environment.apiUrl}/grupos`;
    this.permissoesUrl = `${environment.apiUrl}/permissoes`;
  }

  pesquisar(filtro: GrupoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.gruposUrl}`, { params })
      .toPromise()
      .then(response => {
        const grupos = response.content;

        const resultado = {
          grupos,
          total: response.totalElements
        };

        return resultado;
      });
  }

  listarTodos(): Promise<any> {
    return this.http.get<any>(`${this.gruposUrl}/todos`)
      .toPromise()
      .then(response => response);
  }


  search(): Observable<GrupoSemPermissao[]> {
    return this.http.get<any>(`${this.gruposUrl}/todos`).map(
        res => { return res.map(item => item);
          });
  }

  adicionar(grupo: Grupo): Promise<Grupo> {
    return this.http.post<Grupo>(this.gruposUrl, grupo)
      .toPromise();
  }

  atualizar(grupo: Grupo): Promise<Grupo> {
    console.log('Grupo dentro do Serviço!!! ==>>> ', grupo);
    return this.http.put<Grupo>(`${this.gruposUrl}/${grupo.codigo}`, grupo)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Grupo> {
    return this.http.get<Grupo>(`${this.gruposUrl}/${codigo}`)
      .toPromise();
  }

  buscarPermissaoPorGrupo(codigoGrupo: number): Promise<Grupo> {
    return this.http.get<Grupo>(`${this.permissoesUrl}/${codigoGrupo}`)
      .toPromise();
  }

  listarGrupos(): Promise<Grupo[]> {
    return this.http.get<Grupo[]>(this.gruposUrl).toPromise();
  }

  listarTodasPermissoes(): Promise<Permissao[]> {
    return this.http.get<Permissao[]>(this.permissoesUrl).toPromise();
  }

  listarTodasPermissoesSubScrib(): Observable<Permissao[]> {
    return this.http.get<any>(`${this.permissoesUrl}`).map(
        res => { return res.map(item => item);
          });
  }

}
