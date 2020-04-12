import { Categoria } from '../../core/model';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/toPromise';

import { environment } from '../../../environments/environment';
import { MoneyHttp } from '../../seguranca/money-http';

export class CategoriaFiltro {
  nome: string;
  pagina = 0;
  itensPorPagina = 5;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  categoriasUrl: string;

  constructor(private http: MoneyHttp) {
    this.categoriasUrl = `${environment.apiUrl}/categorias`;
  }

  listarTodas(): Promise<any> {
    return this.http.get(`${this.categoriasUrl}/pesquisa`)
      .toPromise();
  }

  listarTodasCategorias(): Promise<any> {
    return this.http.get<any>(this.categoriasUrl)
      .toPromise()
      .then(response => response.content);
  }


  pesquisar(filtro: CategoriaFiltro): Promise<any> {
    let params = new HttpParams({
      fromObject: {
        page: filtro.pagina.toString(),
        size: filtro.itensPorPagina.toString()
      }
    });

    if (filtro.nome) {
      params = params.append('nome', filtro.nome);
    }

    return this.http.get<any>(`${this.categoriasUrl}`, { params })
      .toPromise()
      .then(response => {
        const categorias = response.content;

        const resultado = {
          categorias,
          total: response.totalElements
        };

        return resultado;
      });
  }


  adicionar(categoria: Categoria): Promise<Categoria> {
    return this.http.post<Categoria>(this.categoriasUrl, categoria)
      .toPromise();
  }

  atualizar(categoria: Categoria): Promise<Categoria> {
    return this.http.put<Categoria>(`${this.categoriasUrl}/${categoria.codigo}`, categoria)
      .toPromise();
  }

  buscarPorCodigo(codigo: number): Promise<Categoria> {
    return this.http.get<Categoria>(`${this.categoriasUrl}/${codigo}`)
      .toPromise();
  }


}
