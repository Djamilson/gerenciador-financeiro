import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { AuthService } from './../../seguranca/auth.service';
import { Title } from '@angular/platform-browser';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { PessoaService } from '../../shared/services/pessoa.service';
import { Lancamento } from './../../core/model';
import { LancamentoService } from '../../shared/services/lancamento.service';

import * as moment from 'moment';
import 'rxjs/add/operator/toPromise';

@Component({
  selector: 'app-lancamento-cadastro',
  templateUrl: './lancamento-cadastro.component.html',
  styleUrls: ['./lancamento-cadastro.component.css'],
  preserveWhitespaces: true,
})

export class LancamentoCadastroComponent extends BaseFormComponent
implements OnInit {

  tipos = [
    { label: 'Receita', value: 'RECEITA' },
    { label: 'Despesa', value: 'DESPESA' },
  ];

  categorias = [];
  pessoas = [];
  loading = false; // Add this line
  listaRepeticaoLancamento = [];
  formulario: FormGroup;
  codigoBaixa: string; // variavel para validar os campos de baixa
  codigoLancamento: number;
  disable = false;

  constructor(
    private categoriaService: CategoriaService,
    private pessoaService: PessoaService,
    private lancamentoService: LancamentoService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private formBuilder: FormBuilder,
    private auth: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.configurarFormulario();

    this.codigoLancamento = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo lançamento');

    if (this.codigoLancamento) {
      this.codigoBaixa = this.route.snapshot.params['baixa'];
      this.carregarLancamento(this.codigoLancamento);
      this.disable = true;
    } else {
      // gera a lista para o usuario com o numero de repetiçoes/lancamentos
      this.geraLista();
    }

    this.carregarCategorias();
    this.carregarPessoas();
  }

  geraLista() {
    let i = 1;
    const final = 12;

    for (i; i <= final; i++) {
      this.listaRepeticaoLancamento.push({ label: i, value: i });
    }

  }

  format(date) {
    if (date !== null) {
      return moment(date).format('DD/MM/YYYY');
    }
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      codigo: [],
      tipo: ['RECEITA', Validators.required],
      numeroLancamento: new FormControl({value: '1', disabled: this.disable}, Validators.required),
      
      dataVencimento: [null, Validators.required],
      dataPagamento: [],
      descricao: [
        null,
        [Validators.required, this.validarTamanhoMinimo(5)],
      ],
      valor: [null, Validators.required],
      valorPagoRecebido: [],
      pessoa: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],
      }),
      categoria: this.formBuilder.group({
        codigo: [null, Validators.required],
        nome: [],
      }),
      observacao: [],
      anexo: [],
      urlAnexo: [],
    });
  }


  validarTamanhoMinimo(valor: number) {
    return (input: FormControl) => {
      return !input.value || input.value.length >= valor
        ? null
        : { tamanhoMinimo: { tamanho: valor } };
    };
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  carregarLancamento(codigo: number) {
    this.lancamentoService
      .buscarPorCodigo(codigo)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);

        if (this.codigoBaixa) {
          this.formulario.get('valorPagoRecebido').setValue(lancamento.valor);
          this.formulario.get('dataPagamento').setValue(new Date());
        }

        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  submit() {
    if (this.editando) {
      this.atualizarLancamento();
    } else {
      this.adicionarLancamento();
    }
  }

  adicionarLancamento() {

    this.lancamentoService
      .adicionar(this.formulario.value)
      .then(lancamentoAdicionado => {
        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento adicionado com sucesso!',
        });
        this.router.navigate(['/lancamentos', lancamentoAdicionado.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarLancamento() {
    this.loading = true; // Add this line
    this.lancamentoService
      .atualizar(this.formulario.value)
      .then(lancamento => {
        this.formulario.patchValue(lancamento);

        this.messageService.add({
          severity: 'success',
          detail: 'Lançamento alterado com sucesso!',
        });
        this.atualizarTituloEdicao();
        this.loading = false; // Add this line
      })
      .catch(erro => {
        this.loading = false; // Add this line
        this.errorHandler.handle(erro);
      });

    this.loading = false; // Add this line
  }

  carregarCategorias() {
    return this.categoriaService
      .listarTodas()
      .then(categorias => {
        this.categorias = categorias.map(c => ({
          label: c.nome,
          value: c.codigo,
        }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  carregarPessoas() {
    this.pessoaService
      .listarTodas()
      .then(pessoas => {
        this.pessoas = pessoas.map(p => ({ label: p.nome, value: p.codigo }));
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  novo() {
    this.formulario.reset();

    setTimeout(
      function() {
        this.lancamento = new Lancamento();
      }.bind(this),
      1
    );

    this.router.navigate(['/lancamentos/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(
      `Edição de lançamento: ${this.formulario.get('descricao').value}`
    );
  }
  refazaConsulta() {
    this.resetar();
    this.codigoBaixa = this.route.snapshot.params['baixa'];
    this.carregarLancamento(this.codigoLancamento);
    this.atualizarTituloEdicao();
  }

  get dataVencimento() {
    return this.formulario.get('dataVencimento');
  }

  get pessoa() {
    return this.formulario.get('pessoa');
  }

  get categoria() {
    return this.formulario.get('categoria');
  }

  get valor() {
    return this.formulario.get('valor');
  }

  get numeroLancamento() {
    return this.formulario.get('numeroLancamento');
  }

  get vencimento() {
    return this.formulario.get('vencimento');
  }

  get descricao() {
    return this.formulario.get('descricao');
  }
}
