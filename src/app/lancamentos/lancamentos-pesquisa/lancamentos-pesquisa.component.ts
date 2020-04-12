import { Title } from '@angular/platform-browser';
import { Component, OnInit, ViewChild } from '@angular/core';

import { LazyLoadEvent, ConfirmationService } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';

import { AuthService } from './../../seguranca/auth.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { LancamentoService, LancamentoFiltro } from '../../shared/services/lancamento.service';

import * as moment from 'moment';


@Component({
  selector: 'app-lancamentos-pesquisa',
  templateUrl: './lancamentos-pesquisa.component.html',
  styleUrls: ['./lancamentos-pesquisa.component.css'],
  preserveWhitespaces: true
})
export class LancamentosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new LancamentoFiltro();
  lancamentos = [];
  @ViewChild('tabela') grid;
  quantidadePaginas = [1, 5];

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
      { field: 'vencimento', header: 'Vencimento', class: 'col-header-data' },
      { field: 'pagamento', header: 'Pagamento', class: 'col-header-data' },
      { field: 'numeroLancamento', header: 'Nº', class: 'col-header-numero-lancamento' },
      { field: 'valor', header: 'Valor', class: 'col-data-header' },
      { field: 'baixa', header: 'Baixa', class: 'col-data-header' },
      { field: 'acao', header: 'Ação', class: 'col-data-header' }
  ];
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  itensPorPaginaPesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.lancamentoService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.lancamentos = resultado.lancamentos;
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

    format(date) {
      if (date !== null) {
      return moment(date).format('DD/MM/YYYY');
     }
    }

    trataPagamento(data: string) {
      if (data === null || data === undefined) {
        return false;
      }
       return true;
    }

    testaTipo(tipo: string) {
      if (tipo === 'RECEITA') {
        return true;
      }
      return false;
    }

    getFormattedPrice(price: number) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(price);
  }

}
