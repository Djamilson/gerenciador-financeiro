import { ConsultaCepService } from './../../shared/services/consulta-cep.service';
import { tap, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { FormValidations } from './../../shared/form-validations';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { PessoaService } from '../../shared/services/pessoa.service';
import { Pessoa, Estado, Cidade} from './../../core/model';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { empty } from 'rxjs';

@Component({
  selector: 'app-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html',
  styleUrls: ['./pessoa-cadastro.component.css']
})

export class PessoaCadastroComponent extends BaseFormComponent implements OnInit {

  formulario: FormGroup;

  pessoa = new Pessoa();

  estados: any[];
  cidades: any[];

  constructor(
    private formBuilder: FormBuilder,
    private pessoaService: PessoaService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,

    private cepService: ConsultaCepService,
  ) {
    super();
  }

  ngOnInit() {
    const codigoPessoa = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova pessoa');

    this.carregarEstados();

    if (codigoPessoa) {
       this.carregarPessoa(codigoPessoa);
    }

    this.configurarFormulario();

    this.pegaCep();
  }

  configurarFormulario() {
    this.formulario =  this.formBuilder.group({

      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]],

      endereco: this.formBuilder.group({
        cep: [null, [Validators.required, FormValidations.cepValidator]],
        numero: [null, Validators.required],
        complemento: [null],
        logradouro: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: this.formBuilder.group({
          codigo: [ null, Validators.required ],
          nome: []
        }),
        estado: this.formBuilder.group({
          codigo: [ null, Validators.required ],
          nome: []
        })
      }),

    });

  }

  pegaCep() {
    this.formulario.get('endereco.cep').statusChanges
    .pipe(
      distinctUntilChanged(),
      tap(value => console.log('status CEP:', value)),
      switchMap(status => status === 'VALID' ?
        this.cepService.consultaCEP(this.formulario.get('endereco.cep').value)
        : empty()
      )
    )
    .subscribe(dados => dados ? this.populaDadosForm(dados) : {});
  }

  consultaCEP() {
    const cep = this.formulario.get('endereco.cep').value;

    if (cep != null && cep !== '') {
            this.cepService.consultaCEP(cep)
      .subscribe(dados => this.populaDadosForm(dados));

    }
  }

  populaDadosForm(dados) {

    if ((dados.uf !== undefined) || (dados.uf !== '')) {
      this.carregarCidadesPorSiglaUF(dados.uf, dados.localidade );
    }

    this.formulario.patchValue({
      endereco: {
        logradouro: dados.logradouro,
        bairro: dados.bairro
      }
    });
  }

  carregarEstados() {
    this.pessoaService.listarEstados().then(lista => {
      this.estados = lista.map(uf => ({ label: uf.nome, value: uf.codigo }));
    })
    .catch(erro => this.errorHandler.handle(erro));
  }

  get editando() {
    return Boolean(this.pessoa.codigo);
  }

  carregarPessoa(codigo: number) {
    this.pessoaService.buscarPorCodigo(codigo)
      .then(pessoa => {

      this.formulario.patchValue(pessoa);

      this.pessoa = pessoa;

      this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


carregarCidadesPorSiglaUF(siglaUF: string, dado: string) {
  console.log('Para testa: ', siglaUF);

  if (siglaUF !== null && siglaUF !== undefined) {
    this.pessoaService.listarCidadePorSiglaUF(siglaUF).then(lista => {
      this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
      const l = lista.filter(e => e.nome === dado);

      for ( let i = 0; i < l.length; i++ ) {

        const cidade = new Cidade();
        const estado = new Estado();

        cidade.codigo = l[i].codigo;
        cidade.nome = l[i].nome;

        console.log('Cidades::: ', cidade);
        this.formulario.get('endereco.cidade').setValue(cidade);

        JSON.parse(JSON.stringify(l[i].estado), (k, v) => {
          if ( k === 'codigo' ) {
            estado.codigo = v;
           }
           if ( k === 'nome') {
            estado.nome =  v;
           }
        });

        this.formulario.get('endereco.estado').setValue(estado);

      }

    })
    .catch(erro => this.errorHandler.handle(erro));

  }
}

carregarCidades() {
  const codigo = this.formulario.get('endereco.estado.codigo').value;

  this.pessoaService.pesquisarCidades(codigo).then(lista => {
    this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
  })
  .catch(erro => this.errorHandler.handle(erro));
}

carregarCidadesPorEstado(estado: number) {
  this.pessoaService.pesquisarCidades(estado).then(lista => {
    this.cidades = lista.map(c => ({ label: c.nome, value: c.codigo }));
  })
  .catch(erro => this.errorHandler.handle(erro));
}

submit() {
     if (this.editando) {
      this.atualizarPessoa();
    } else {
      this.adicionarPessoa();
    }
}

  adicionarDadosFormulario() {
    const dadosFormulario = this.formulario.value;

    this.pessoa.nome = dadosFormulario.nome;

    this.pessoa.endereco.cep = dadosFormulario.endereco.cep;
    this.pessoa.endereco.logradouro = dadosFormulario.endereco.logradouro;
    this.pessoa.endereco.numero = dadosFormulario.endereco.numero;
    this.pessoa.endereco.complemento = dadosFormulario.endereco.complemento;
    this.pessoa.endereco.bairro = dadosFormulario.endereco.bairro;
    this.pessoa.endereco.cidade = dadosFormulario.endereco.cidade;
  }

  adicionarPessoa() {

  this.adicionarDadosFormulario();

  console.log('Pessoa::: ', this.pessoa);
    this.pessoaService.adicionar(this.pessoa)
      .then(pessoaAdicionada => {
        this.messageService.add({ severity: 'success', detail: 'Pessoa adicionada com sucesso!' });
        this.router.navigate(['/pessoas', pessoaAdicionada.codigo]);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  atualizarPessoa() {

  this.adicionarDadosFormulario();

    this.pessoaService.atualizar(this.pessoa)
      .then(pessoa => {
        this.pessoa = pessoa;

        this.messageService.add({ severity: 'success', detail: 'Pessoa alterada com sucesso!' });
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  nova() {
    this.formulario.reset();

    setTimeout(function() {
      this.pessoa = new Pessoa();
    }.bind(this), 1);

    this.router.navigate(['/pessoas/nova']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de pessoa: ${this.pessoa.nome}`);
  }

}
