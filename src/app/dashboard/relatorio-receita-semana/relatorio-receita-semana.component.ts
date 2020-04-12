import { LancamentoService, LancamentoFiltro } from '../../shared/services/lancamento.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { Component, OnInit, ViewChild } from '@angular/core';

import * as moment from 'moment';

@Component({
  selector: 'app-relatorio-receita-semana',
  templateUrl: './relatorio-receita-semana.component.html',
  styleUrls: ['./relatorio-receita-semana.component.css'],
  preserveWhitespaces: true
})
export class RelatorioReceitaSemanaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  receitas = [];
  @ViewChild('tabelaReceita') grid;
  totalReceitas = 0;

  cols: any[];

  constructor(
    private lancamentoService: LancamentoService,
    private errorHandler: ErrorHandlerService
  ) { }

  ngOnInit() {

    this.cols = [
      { field: 'pessoa', header: 'Pessoa' , class: 'col-data-header'},
      { field: 'descricao', header: 'Descricao', class: 'col-data-header'},
      { field: 'vencimento', header: 'Vencimento', class: 'col-data-headerr' },
      { field: 'numeroLancamento', header: 'nº', class: 'col-header-numero-lancamento' },
      { field: 'valor', header: 'Valor', class: 'col-data-headerr' } ];

          // primeiro dia da semana
    this.filtro.dataVencimentoInicio = new Date(moment().startOf('week').format('YYYY-MM-DD'));
    // último dia da semana
    this.filtro.dataVencimentoFim = new Date(moment().endOf('week').format('YYYY-MM-DD'));

  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.filtro.tipo = 'RECEITA';
    this.filtro.componenteAngular = this.filtro.tipo;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.receitas = resultado.lancamentos;

        this.calcularTotal();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }


calcularTotal() {
  const totalItens = this.receitas
    .map(i => (i.valor))
    .reduce((total, v) => total + v, 0);

  this.totalReceitas = totalItens;
}

format(date) {
  if (date !== null) {
    return moment(date).format('DD/MM/YYYY');
   }
}


getFormattedPrice(price: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
}

getTestaData(date) {

  if (moment(date).format('YYYY-MM-DD') < moment().format('YYYY-MM-DD')) {
  return 'bg-danger text-white ';
  } else if (moment(date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
    return 'bg-success text-white';
  }

}

}
