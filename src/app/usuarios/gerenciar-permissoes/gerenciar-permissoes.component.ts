import { MessageService } from 'primeng/components/common/messageservice';
import { tap, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Grupo } from './../../core/model';
import { GrupoService } from './../../shared/services/grupo.service';
import { FormValidations } from './../../shared/form-validations';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  FormArray,
  Validators
} from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gerenciar-permissoes',
  templateUrl: './gerenciar-permissoes.component.html',
  styleUrls: ['./gerenciar-permissoes.component.css'],
  preserveWhitespaces: true
})
export class GerenciarPermissoesComponent extends BaseFormComponent
  implements OnInit {
  loading = false;
  formulario: FormGroup;
  grupos = [];
  sub: Subscription[] = [];
  grupo = new Grupo();
  permissoesBanco = [];
  permissoesBancoOriginal = [];

  constructor(
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private fb: FormBuilder,
    private grupoService: GrupoService,
    private messageService: MessageService

  ) {
    super();
    console.clear();
  }

  ngOnInit() {
    this.title.setTitle('Configurando permissões');
    this.carregarPermissoesdoBanco();
  }

  configurarFormulario(): FormGroup {
    return this.fb.group({
      codigo: [null, Validators.required],
      nome: [],
      descricao: [],
      permissoes: this.build()
    });
  }

  build() {
    const values = this.permissoesBancoOriginal.map(v => new FormControl(false));
    return this.fb.array(values, FormValidations.requiredMinCheckbox(1));
  }

  get listaPermissoes() {
    return this.permissoesBancoOriginal
      ? (this.formulario.get('permissoes') as FormArray)
      : null;
  }

  novo() {
    this.resetar();
    setTimeout(
      function() {
        this.grupo = new Grupo();
      }.bind(this),
      1
    );

    this.router.navigate(['/usuarios/gerenciar']);
  }

  carregarPermissoesdoBanco() {
    this.grupoService
      .listarTodasPermissoes()
      .then(listaPermissoes => {
        this.permissoesBancoOriginal = listaPermissoes;

        let valueGrupoComPermissao = Object.assign({}, this.grupo);

        valueGrupoComPermissao = Object.assign(valueGrupoComPermissao, {
          permissoes: listaPermissoes.map( () => {
            return true;
          })
        });

        return valueGrupoComPermissao;
      })
      .then(resp => {
        this.permissoesBanco = resp.permissoes;

        this.carregarGrupos();
        this.formulario = this.configurarFormulario();
      })
      .catch(erro => this.errorHandler.handle(erro));

      this.formulario = this.configurarFormulario();
  }

  // valida a opcao para mostra no pTooltip para o usuario
  grupoFormpTooltip(indice: number) {

    const values = this.formulario.value.permissoes;
     for (let i = 0; i < values.length; i++) {
      if (values[indice]) {
     return values[indice];
      }
    }
  }


  // valida a opcao para mostra no pTooltip para o usuario
  retornDescricaoPermissao(indice: number) {
    const values = this.permissoesBancoOriginal;
    for (let i = 0; i < values.length; i++) {
      if (values[indice]) {
        return values[indice].descricao;
      }
    }
  }


  carregarGrupos() {
    this.loading = true;
    this.sub.push(
      this.grupoService
        .search()
        .pipe(tap(v => console.log(this.grupos, v)))
        .subscribe(lista => {
          this.grupos = lista.map(g => ({
            label: g.nome,
            value: g.codigo
          }));

          // tem que inicializar aqui para poder pegar a lista de grupos
          this.loading = false;
        })
    );
  }

  carregarPermissoes() {

    this.grupo = this.formulario.value;

    this.grupoService
      .buscarPermissaoPorGrupo(this.grupo.codigo)
      .then(grupo => {
        this.grupo = grupo;

        let valueSubmitt = Object.assign({}, grupo);

        valueSubmitt = Object.assign(valueSubmitt, {
          permissoes: this.permissoesBancoOriginal.map((v, i) => {
            let retorno = false;
            grupo.permissoes.map(grupodoUsuario => {
              if (v.codigo === grupodoUsuario.codigo) {
                retorno = true;
              }
            });
            return retorno;
          })
        });
        grupo = valueSubmitt;
         return grupo;
      })
      .then(resp => {
           this.formulario.patchValue(resp);
       })
      .catch(erro => this.errorHandler.handle(erro));
  }

  submit() {
    this.atualizarGruposComPermissoes();
  }

  private trataDadosParaSalvar() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);
    console.log(valueSubmit);

    valueSubmit = Object.assign(valueSubmit, {
      permissoes: valueSubmit.permissoes
        .map((v, i) => (v ? this.permissoesBancoOriginal[i] : null))
        .filter(v => v !== null)
    });
    return valueSubmit;
  }

  atualizarGruposComPermissoes() {
    this.loading = true;

    const dadosFormulario = this.trataDadosParaSalvar();

    console.log('Dados do meu form::=>> ', dadosFormulario);

    this.grupoService
      .atualizar(dadosFormulario)
      .then(grupo => {
        this.grupo = grupo;

        this.messageService.add({
          severity: 'success',
          detail: 'Grupo alterado com sucesso!'
        });

        this.refazaConsulta();
        this.loading = false;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  refazaConsulta() {
    this.resetar();
   // this.carregarUsuario(this.meuCodigo);
   // this.atualizarTituloEdicao();
  }
  get editando() {
    return Boolean(this.formulario.get('permissoes').value);
  }

  get codigoGrupo() {
return Boolean(this.formulario.get('codigo').value);
  }
}
