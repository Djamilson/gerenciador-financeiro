import { MoneyHttp } from './../../seguranca/money-http';
import { Injectable } from '@angular/core';

import 'rxjs/operator/toPromise';
import * as moment from 'moment';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  lancamentosUrl: string;

  constructor(private http: MoneyHttp) {
    this.lancamentosUrl = `${environment.apiUrl}/lancamentos`;
  }

  lancamentosPorCategoria(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-categoria`)
      .toPromise();
  }

  lancamentosPorDia(): Promise<Array<any>> {
    return this.http.get<Array<any>>(`${this.lancamentosUrl}/estatisticas/por-dia`)
      .toPromise()
      .then(response => {
        const dados = response;
        this.converterStringsParaDatas(dados);

        return dados;
      });
  }


  totalReceitasMenosDespesasMes(): Promise<any> {
    return this.http.get<any>(`${this.lancamentosUrl}/totalReceitasMenosDespesasMes`)
      .toPromise()
      .then(response => {
        const totalReceitaMes = response;
        return totalReceitaMes;
      });
  }


  totalReceitasMes(): Promise<any> {
    return this.http.get<any>(`${this.lancamentosUrl}/totalReceitasMes`)
      .toPromise()
      .then(response => {
        const totalReceitaMes = response;
        return totalReceitaMes;
      });
  }

  totalDespesasMes(): Promise<any> {
    return this.http.get<any>(`${this.lancamentosUrl}/totalDespesasMes`)
      .toPromise()
      .then(response => {
        const totalDespesasMes = response;
        return totalDespesasMes;
      });
  }
  private converterStringsParaDatas(dados: Array<any>) {
    for (const dado of dados) {
      dado.dia = moment(dado.dia, 'YYYY-MM-DD').toDate();
    }
  }
}
