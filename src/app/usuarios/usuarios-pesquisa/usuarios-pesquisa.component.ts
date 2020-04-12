import { UsuarioFiltro, UsuarioService } from '../../shared/services/usuario.service';
import { Title } from '@angular/platform-browser';
import { ConfirmationService, LazyLoadEvent, SelectItem } from 'primeng/components/common/api';
import { MessageService } from 'primeng/components/common/messageservice';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-usuarios-pesquisa',
  templateUrl: './usuarios-pesquisa.component.html',
  styleUrls: ['./usuarios-pesquisa.component.css'],
  preserveWhitespaces: true
})
export class UsuariosPesquisaComponent implements OnInit {

  totalRegistros = 0;
  filtro = new UsuarioFiltro();
  grupo = [];
  @ViewChild('tabela') grid;
  usuarios = [];

  cols: any[];

  constructor(
    private usuarioService: UsuarioService,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private confirmation: ConfirmationService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle('Pesquisa usuário');
    this.initColuna();
}

  private initColuna() {
    this.cols = [
      { field: '#', header: '#' , class: 'col-header-id'},
      { field: 'nome', header: 'Nome' , class: 'col-data-header'},
      { field: 'sobreNome', header: 'Sobre Nome' , class: 'col-data-header'},
      { field: 'status', header: 'Status', class: 'col-data-header' },
      { field: 'acao', header: 'Ação', class: 'col-data-header' }
    ];
  }

  pesquisar(pagina = 0) {
    this.filtro.pagina = pagina;

    this.usuarioService.pesquisar(this.filtro)
      .then(resultado => {
        this.totalRegistros = resultado.total;
        this.usuarios = resultado.usuarios;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  aoMudarPagina(event: LazyLoadEvent) {
    const pagina = event.first / event.rows;
    this.pesquisar(pagina);
  }

  confirmarExclusao(usuario: any) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(usuario);
      }
    });
  }

  excluir(usuario: any) {
    this.usuarioService.excluir(usuario.codigo)
      .then(() => {
        if (this.grid.first === 0) {
          this.pesquisar();
        } else {
          this.grid.first = 0;
        }

        this.messageService.add({ severity: 'success', detail: 'Usuario excluído com sucesso!' });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  alternarStatus(usuario: any): void {
    const novoStatus = !usuario.ativo;

    this.usuarioService.mudarStatus(usuario.codigo, novoStatus)
      .then(() => {
        const acao = novoStatus ? 'ativada' : 'desativada';

        usuario.ativo = novoStatus;
        this.messageService.add({ severity: 'success', detail: `Usuário ${acao} com sucesso!` });
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

}
