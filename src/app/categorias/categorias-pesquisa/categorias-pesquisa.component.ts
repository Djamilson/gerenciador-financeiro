import { CategoriaFiltro, CategoriaService } from '../../shared/services/categoria.service';
import { Title } from '@angular/platform-browser';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ConfirmationService, LazyLoadEvent } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-categorias-pesquisa',
  templateUrl: './categorias-pesquisa.component.html',
  styleUrls: ['./categorias-pesquisa.component.css']
})
export class CategoriasPesquisaComponent implements OnInit {

  filtro = new CategoriaFiltro();
  categorias = [];
  totalRegistros = 0;
  @ViewChild('tabela') grid;

  cols: any[];

  constructor(
    private categoriaService: CategoriaService,
    private errorHandler: ErrorHandlerService,
    private confirmation: ConfirmationService,
    private messageService: MessageService,
    private title: Title) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa de pessoas');

    this.cols = [
      { field: '#', header: '#' , class: 'col-header-id'},
      { field: 'nome', header: 'Nome' , class: 'col-data-header'},
      { field: 'acao', header: 'Ação', class: 'col-data-header' }
  ];

  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.categoriaService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.categorias = resultado.categorias;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }


}
