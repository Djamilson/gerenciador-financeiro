import { RequestOptions, Headers, ResponseContentType } from '@angular/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { Imagem } from './../../core/model';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { Lancamento } from '../../core/model';
import { MoneyHttp } from '../../seguranca/money-http';

export class LancamentoFiltro {
  componenteAngular: string;
  descricao: string;
  tipo: string;
  dataVencimentoInicio: Date;
  dataVencimentoFim: Date;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class LancamentoService {

  lancamentosUrl: string;
  anexoLancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
    this.anexoLancamentosUrl = `${environment.apiUrl}/imagens`;
  }

  urlUploadAnexo(): string {
    return `${this.lancamentosUrl}/anexo`;
  }

  pesquisar(filtro: LancamentoFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.componenteAngular) {
      params = params.append('componenteAngular', filtro.componenteAngular);
    }

    if (filtro.descricao) {
      params = params.append('descricao', filtro.descricao);
    }

    if (filtro.tipo) {
      params = params.append('tipoLancamento', filtro.tipo);
    }

    if (filtro.dataVencimentoInicio) {
      params = params.append('dataVencimentoDe',
        moment(filtro.dataVencimentoInicio).format('YYYY-MM-DD'));
    }

    if (filtro.dataVencimentoFim) {
      params = params.append('dataVencimentoAte',
        moment(filtro.dataVencimentoFim).format('YYYY-MM-DD'));
    }

    return this.http.get<any>(`${this.lancamentosUrl}?resumo`,
        { params })
      .toPromise()
      .then(response => {
        const lancamentos = response.content;

        const resultado = {
          lancamentos,
          total: response.totalElements
        };

        return resultado;
      });
  }


  excluir(codigo: number): Promise<void> {
    return this.http.delete(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }

  adicionar(lancamento: Lancamento): Promise<Lancamento> {
    // data cad
    return this.http.post<Lancamento>(this.lancamentosUrl, lancamento)
      .toPromise();
  }

  atualizar(lancamento: Lancamento): Promise<Lancamento> {
    return this.http.put<Lancamento>(`${this.lancamentosUrl}/${lancamento.codigo}`, lancamento)
      .toPromise()
      .then(response => {
        const lancamentoAlterado = response;

        this.converterStringsParaDatas([lancamentoAlterado]);

        return lancamentoAlterado;
      });
  }

  buscarAnexoPorLancamentoCodigo(codigoLancamento: number): Promise<any> {
    return this.http.get(`${this.anexoLancamentosUrl}?codigo=${codigoLancamento}`)
      .toPromise();
  }


  excluirAnexo(codigo: number): Promise<void> {
    return this.http.delete(`${this.anexoLancamentosUrl}/${codigo}`)
      .toPromise()
      .then(() => null);
  }


buscarAnexoParaDownload(condigoImagem: number): Promise<any> {

  const params = new HttpParams();

  return this.http.get(`${this.lancamentosUrl}/anexo?anexo=${condigoImagem}`, { params, responseType: 'blob' })
      .toPromise();
  }

  getFiles(): Observable<any> {
    return this.http.get('http://localhost:8080/api/file/info');
  }


/*
  download(documentId: string): Observable<any> {
    // set headers for the file and response to be Blob
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers });
    options.responseType = ResponseContentType.Blob;

    return this.http.get(documentId, options)
      .map((res: Response) => res);
  }
*/
  getTextFile(filename: string) {
    // The Observable returned by get() is of type Observable<string>
    // because a text response was specified.
    // There's no need to pass a <string> type parameter to get().
    return this.http.get(filename, {responseType: 'blob'})
      .pipe(
        tap( // Log the result or error
          data => console.log(filename, data),
          error => console.log(filename, error)
        )
      );
  }

  buscarPorCodigo(codigo: number): Promise<Lancamento> {
    return this.http.get<Lancamento>(`${this.lancamentosUrl}/${codigo}`)
      .toPromise()
      .then(response => {
        const lancamento = response;

        this.converterStringsParaDatas([lancamento]);

        return lancamento;
      });
  }

  private converterStringsParaDatas(lancamentos: Lancamento[]) {
    for (const lancamento of lancamentos) {
      lancamento.dataVencimento = moment(lancamento.dataVencimento,
        'YYYY-MM-DD').toDate();
      lancamento.dataCad = moment(lancamento.dataCad, 'YYYY-MM-DD[T]HH:mm:ss').toDate();


      if (lancamento.dataPagamento) {
        lancamento.dataPagamento = moment(lancamento.dataPagamento,
          'YYYY-MM-DD').toDate();
      }

      if (lancamento.dataBaixa) {
        lancamento.dataBaixa = moment(lancamento.dataBaixa, 'YYYY-MM-DD[T]HH:mm:ss').toDate();
      }

    }
  }

  downloadFile(file: string) {
    const body = {filename: file};

    return this.http.post('https://elasticbeanstalk-us-east-1-655057965690.s3.amazonaws.com', body, {
        responseType : 'blob',
        headers: new HttpHeaders().append('Content-Type', 'application/json')
    });
}

}
