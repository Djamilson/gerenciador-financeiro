import { LancamentoService } from '../../shared/services/lancamento.service';
import { AuthService } from './../../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LancamentoFiltro } from '../../shared/services/lancamento.service';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { ConfirmationService, LazyLoadEvent } from 'primeng/components/common/api';

import * as moment from 'moment';

@Component({
  selector: 'app-lancamentos-receitas',
  templateUrl: './lancamentos-receitas.component.html',
  styleUrls: ['./lancamentos-receitas.component.css'],
  preserveWhitespaces: true
})
export class LancamentosReceitasComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  receitas = [];
  @ViewChild('tabela') grid;
  totalReceitas = 0;

  dataHoje = new Date();

  cols: any[];

  constructor(
    private lancamentoService: LancamentoService,
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de lançamentos');

    this.cols = [
      { field: '#', header: '#' , class: 'col-header-id'},
      { field: 'pessoa', header: 'nome' , class: 'col-data-header'},
      { field: 'descricao', header: 'Descricao', class: 'col-data-header'},
      { field: 'vencimento', header: 'Vencimento', class: 'col-data-header' },
      { field: 'recebimento', header: 'Recebimento', class: 'col-data-header' },
      { field: 'valor', header: 'Valor', class: 'col-data-header' },
      { field: 'recebido', header: 'Recebido', class: 'col-data-header' },
      { field: 'acao', header: 'Ação', class: 'col-data-header' }
  ];
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;
    this.filtro.tipo = 'RECEITA';
  //  this.filtro.componenteAngular = this.filtro.tipo;

    // primeiro dia do mês, tem que muda a posição para nao da error 'MM-DD-YYYY'
    this.filtro.dataVencimentoInicio = new Date(moment().startOf('month').format('MM-DD-YYYY'));
    // último dia do mês
    this.filtro.dataVencimentoFim = new Date(moment().endOf('month').format('MM-DD-YYYY'));

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

  confirmarExclusao(lancamento: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(lancamento);
      }
    });
  }

  excluir(lancamento: any) {
    this.lancamentoService.excluir(lancamento.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


calcularTotal() {
  const totalItens = this.receitas
    .map(i => (i.valor))
    .reduce((total, v) => total + v, 0);

  this.totalReceitas = totalItens;
}

trataPagamento(data: string) {

  if (data === null || data === undefined) {
    return false;
  }

  return true;
}

  format(date) {
    if (date !== null) {
      return moment(date).format('DD/MM/YYYY');
     }  }


    testaTipo(tipo: string) {
      if (tipo === 'RECEITA') {
        return true;
      }
      return false;
    }

     getFormattedPrice(price: number) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
    }

    getValorMaiorZero(price: number) {
      if (price > 0) {
        return true;
      }
      return false;
    }

}
