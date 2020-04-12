import { LancamentoService } from './../../../shared/services/lancamento.service';
import { ErrorHandlerService } from './../../../core/error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../../seguranca/auth.service';
import { Imagem } from './../../../core/model';
import { Component, OnInit, Input, Output, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';

import * as moment from 'moment';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
  preserveWhitespaces: true
})
export class DataTableComponent implements OnInit {

  @Input() codigoLancamento: number;

  @ViewChild('tabela') grid;

  loading = false; // Add this line
  uploadEmAndamento = false;
  urlAnexo: string;
  anexo = new Imagem();
  files: Array<any> = [];
  cols: any[];

  exbindoAnexo = false;

  constructor(
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private confirmation: ConfirmationService,
    private auth: AuthService
  ) {}

  ngOnInit() {

    if (this.codigoLancamento) {
      this.carregarAnexoPorLancamento();
    }

    this.cols = [
      { field: '#', header: '#', class: 'col-header-id' },
      { field: 'nome', header: 'Nome', class: 'col-data-header' },
      { field: 'dataCad', header: 'Data cadastro', class: 'col-header-data' },
      { field: 'acao', header: 'Ação', class: 'col-data-header' }
    ];

  }

  prepararParaVisualizarAnexo(anexo: Imagem) {
    this.loading = true; // Add this line
    this.urlAnexo = null;
    this.anexo = new Imagem();
    this.anexo = anexo;

    this.urlAnexo = 'https:'.concat(anexo.caminho_s3);
    console.log('this.anexoSelecionadoUrl', this.urlAnexo);
    this.exbindoAnexo = true;
    this.loading = false;
  }

  get urlUploadAnexo() {
    return this.lancamentoService
      .urlUploadAnexo()
      .concat('?codigo=', this.route.snapshot.params['codigo']);
  }


  carregarAnexoPorLancamento() {

    this.lancamentoService
      .buscarAnexoPorLancamentoCodigo(this.codigoLancamento)
      .then(anexos => {
        this.files = anexos;
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  confirmarExclusao(codigoImamgem: number) {
    this.confirmation.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.excluir(codigoImamgem);
      }
    });
  }

  excluir(codigoImamgem: number) {
    this.loading = true; // Add this line

    this.lancamentoService.excluirAnexo(codigoImamgem)
      .then(() => {
        if (this.grid.first === 0) {
          this.carregarAnexoPorLancamento();
        } else {
          this.grid.first = 0;
        }
        this.loading = false; // Add this line

        this.messageService.add({ severity: 'success', detail: 'Lançamento excluído com sucesso!' });
      })
      .catch(erro => {
        this.loading = false; // Add this line

        this.errorHandler.handle(erro); });
  }

  get totalRegistro () {
    return Boolean(this.files.length);
  }
  antesUploadAnexo(event) {
    this.loading = true; // Add this line

     event.xhr.setRequestHeader(
       'Authorization',
       'Bearer ' + localStorage.getItem('token')
     );
     console.log('.... antes do upload', event);
     this.uploadEmAndamento = true;
   }

   aoTerminarUploadAnexo(event) {
     console.log('.... Finalizando agora chama a outra função: ', event);
     // this.carregarAnexoPorLancamento();

     console.log('Meu retorno: ', event.xhr.response);
     this.files = JSON.parse(event.xhr.response);
     this.loading = false; // Add this line
     this.uploadEmAndamento = false;
   }

   erroUpload(event) {
     this.messageService.add({
       severity: 'error',
       detail: 'Erro ao tentar enviar anexo!'
     });

     this.uploadEmAndamento = false;
   }

   format(date) {
    if (date !== null) {
      return moment(date).format('DD/MM/YYYY');
    }
  }

  carregarAnexoParaDownload(imagem: Imagem) {
    this.loading = true; // Add this line

    const nomeImagem = imagem.nome;

    this.lancamentoService
      .buscarAnexoParaDownload(imagem.codigo)
      .then(anexo => {

        const ieEDGE = navigator.userAgent.match(/Edge/g);
        const ie = navigator.userAgent.match(/.NET/g); // IE 11+
        const oldIE = navigator.userAgent.match(/MSIE/g);

        if (ie || oldIE || ieEDGE) {
          window.navigator.msSaveBlob(anexo, nomeImagem); // For IE browser
        } else {
          window.URL =
            window.URL ||
            (window as any).webkitURL ||
            (window as any).mozURL ||
            (window as any).msURL;

          const url = window.URL.createObjectURL(anexo);
          const a = document.createElement('a');

          a.href = url;
          a.download = nomeImagem;
          a.click();
          setTimeout(() => {
            window.URL.revokeObjectURL(url);
          }, 100);
        }
        this.loading = false; // Add this line

      })
      .catch(erro => { this.loading = false; // Add this line
        this.errorHandler.handle(erro); });
  }

}
