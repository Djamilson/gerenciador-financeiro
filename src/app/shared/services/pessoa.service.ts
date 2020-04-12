import { map } from 'rxjs/operators';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Pessoa, Estado, Cidade } from '../../core/model';
import { MoneyHttp } from '../../seguranca/money-http';

export class PessoaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  pessoasUrl: string;
  cidadesUrl: string;
  cidadesUrlSiglaUT: string;
  estadosUrl: string;

  constructor(private http: MoneyHttp) {
    this.pessoasUrl = `${environment.apiUrl}/pessoas`;
    this.estadosUrl = `${environment.apiUrl}/estados`;
    this.cidadesUrl = `${environment.apiUrl}/cidades`;
    this.cidadesUrlSiglaUT = `${environment.apiUrl}/cidades/findBySigla`;
  }

  pesquisar(filtro: PessoaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.pessoasUrl}`, { params })
      .toPromise()
      .then(response => {
        const pessoas = response.content;

        const resultado = {
          pessoas,
          total: response.totalElements
        };

        return resultado;
      });
  }

  listarTodas(): Promise<any> {
    return this.http.get<any>(this.pessoasUrl)
      .toPromise()
      .then(response => response.content);
  }

  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.pessoasUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  mudarStatus(codigo: number, ativo: boolean): Promise<void> {
    const headers = new HttpHeaders()
        .append('Content-Type', 'application/json');

    return this.http.put(`${this.pessoasUrl}/${codigo}/ativo`, ativo, { headers })
      .toPromise()
      .then(() => null);
  }

  adicionar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.post<Pessoa>(this.pessoasUrl, pessoa)
      .toPromise();
  }

  atualizar(pessoa: Pessoa): Promise<Pessoa> {
    return this.http.put<Pessoa>(`${this.pessoasUrl}/${pessoa.codigo}`, pessoa)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Pessoa> {
    return this.http.get<Pessoa>(`${this.pessoasUrl}/${codigo}`)
      .toPromise();
  }

  buscaCidadePorCodigo(codigo: number): Promise<Cidade> {
    return this.http.get<Cidade>(`${this.cidadesUrl}/${codigo}`).toPromise();
  }

  listarEstados(): Promise<Estado[]> {
    return this.http.get<Estado[]>(this.estadosUrl).toPromise();
  }

 /* listarCidadePorSiglaUF(sigla: string): Promise<Cidade> {

    console.log('Sigla: ', sigla);
    return this.http.get<Cidade>(`${this.cidadesUrl}/findBySigla?sigla=${sigla}`)
      .toPromise();
  }
*/

listarCidadePorSiglaUF(sigla: string): Promise<Cidade[]> {
    const params = new HttpParams()
      .append('sigla', sigla);

    return this.http.get<Cidade[]>(this.cidadesUrlSiglaUT, {
      params
    }).toPromise();
  }

  pesquisarCidades(estado): Promise<Cidade[]> {
    const params = new HttpParams()
      .append('estado', estado);

    return this.http.get<Cidade[]>(this.cidadesUrl, {
      params
    }).toPromise();
  }

  getCidades(estado: number) {
    const params = new HttpParams()
      .append('estado', estado.toString());

    return this.http.get<Cidade[]>(this.cidadesUrl, {
      params
    })   .pipe(
      // tslint:disable-next-line:triple-equals
      map((cidades: Cidade[]) => cidades.filter(c => c.estado == estado))
    );
  }


}
