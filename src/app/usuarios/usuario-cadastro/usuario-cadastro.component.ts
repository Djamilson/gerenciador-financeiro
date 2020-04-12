import { tap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormValidations } from './../../shared/form-validations';

import { GrupoService } from '../../shared/services/grupo.service';
import { UsuarioService } from '../../shared/services/usuario.service';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router, Event } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators,
  FormArray
} from '@angular/forms';

import { MessageService } from 'primeng/components/common/messageservice';

import { ErrorHandlerService } from './../../core/error-handler.service';
import { Usuario, Grupo } from './../../core/model';

@Component({
  selector: 'app-usuario-cadastro',
  templateUrl: './usuario-cadastro.component.html',
  styleUrls: ['./usuario-cadastro.component.css'],
  preserveWhitespaces: true
})
export class UsuarioCadastroComponent extends BaseFormComponent
  implements OnInit, OnDestroy {

  usuario = new Usuario();
  grupo = new Grupo();

  grupos: any[] = [];
  listaGrupoBanco: any[] = [];
  sub: Subscription[] = [];

  cols: any[];

  formulario: FormGroup;
  disabled = false;
  loading = false;
  meuCodigo: number;

  constructor(
    private grupoService: GrupoService,
    private usuarioService: UsuarioService,
    private messageService: MessageService,
    private errorHandler: ErrorHandlerService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.cols = [
      { header: '#', class: 'col-data-header' },
      { header: 'Nome', class: 'col-data-header' },
      { header: 'Descricao', class: 'col-data-header' },
      { header: 'Ação', class: 'col-data-header' }
    ];

    this.meuCodigo = this.route.snapshot.params['codigo'];
    const codigoUsuario = this.route.snapshot.params['codigo'];

    this.title.setTitle('Novo usuário');
    this.carregarGrupos();

    // this.onChanges();

    if (codigoUsuario) {
      console.log('Buscou usuario para editar>>>> ', codigoUsuario);
      this.carregarUsuario(codigoUsuario);
      this.disabled = true;
    }

    this.formulario = this.configurarFormulario();
    console.log('================>>>> ', this.formulario);

    //  this.formulario.valueChanges.subscribe(value => console.log('Form.valueChanges:', value));
  }

  carregarGrupos() {
    this.loading = true;
    this.sub.push(
      this.grupoService
        .search()
        .pipe(tap(v => console.log(this.listaGrupoBanco, v)))
        .subscribe(lista => {
          this.listaGrupoBanco = lista;

          this.grupos = lista;
          // tem que inicializar aqui para poder pegar a lista de grupos
          this.formulario = this.configurarFormulario();
          this.loading = false;
        })
    );
  }

  configurarFormulario(): FormGroup {
    return this.fb.group({
      codigo: [],
      nome: [
        null,
        [Validators.required, Validators.minLength(5), Validators.maxLength(35)]
      ],
      sobreNome: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(155)
        ]
      ],
      email: [
        null,
        [Validators.required, Validators.email],
        [this.validarEmail.bind(this)]
      ],
      confirmaEmail: [
        null,
        [Validators.required, FormValidations.equalsTo('email')]
      ],
      dataNascimento: [null, Validators.required],
      senha: [
        null,
        Validators.compose([
          Validators.required,
          // check whether the entered password has a number
          FormValidations.patternValidator(/\d/, {
            hasNumber: true
          }),
          // check whether the entered password has upper case letter
          FormValidations.patternValidator(/[A-Z]/, {
            hasCapitalCase: true
          }),
          // check whether the entered password has a lower case letter
          FormValidations.patternValidator(/[a-z]/, {
            hasSmallCase: true
          }),
          // check whether the entered password has a special character
          FormValidations.patternValidator(
            /[ !@#$%^&*()_+\-=\[\]{};':'\\|,.<>\/?]/,
            {
              hasSpecialCharacters: true
            }
          ),
          Validators.minLength(8)
        ])
      ],
      confirmaSenha: [
        null,
        [Validators.required, FormValidations.comparaSenha('senha')]
      ],
      grupos: this.buildGrupos()
    });
  }

  buildGrupos() {
    const values = this.grupos.map(v => new FormControl(false));

    return this.fb.array(values, FormValidations.requiredMinCheckbox(1));
  }

  get listaGrupos() {
    return <FormArray>this.formulario.get('grupos');
  }

  carregarGruposPorId(codigo: number) {
    this.grupoService
      .buscarPorCodigo(codigo)
      .then(grupo => {
        this.grupo = new Grupo();
        this.grupo = grupo;
        console.log('Curso: ', this.grupo.nome);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  // valida a opcao para mostra no pTooltip para o usuario
  grupoFormpTooltip(indice: number) {
    const values = this.listaGrupos.controls;
    for (let i = 0; i < values.length; i++) {
      if (values[indice].value) {
        return values[indice].value;
      }
    }
  }

  carregarUsuario(codigo: number) {
    this.usuarioService
      .buscarPorCodigo(codigo)
      .then(usuario => {
        this.usuario = usuario;

        this.formulario
          .get('email')
          .setValue(usuario.email, { onlySelf: true, emitEvent: false });
        this.formulario
          .get('confirmaEmail')
          .setValue(usuario.email, { onlySelf: true, emitEvent: false });

        this.formulario
          .get('senha')
          .patchValue(usuario.senha, { onlySelf: true, emitEvent: false });

        this.formulario
          .get('confirmaSenha')
          .patchValue(usuario.senha, { onlySelf: true, emitEvent: false });

        let valueSubmit = Object.assign({}, usuario);

        valueSubmit = Object.assign(valueSubmit, {
          grupos: this.grupos.map((v, i) => {
            let retorno = false;
            usuario.grupos.map(grupodoUsuario => {
              if (v.codigo === grupodoUsuario.codigo) {
                retorno = true;
              }
            });
            return retorno;
          })
        });

        usuario = valueSubmit;
        console.log('valueSubmit>>= ', valueSubmit);
        return usuario;
      })
      .then(resp => {
        this.atualizarTituloEdicao();
        this.formulario.patchValue(resp);
        console.log('>>>>>>>>>>>>>>>>>:', resp);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  // funcao que habilita o btn Submit quando estiver editando os dados
  get campoFoiAlterado() {
    if (this.codigoBom) {
      return !Boolean(
        this.codigoBom &&
          (this.nome.dirty !== false ||
            this.sobreNome.dirty !== false ||
            this.dataNascimento.dirty !== false ||
            this.grupoFormArray.dirty !== false)
      );
    }
    return Boolean(this.formulario.invalid);
  }

  submit() {
    if (this.editando) {
      this.atualizarUsuario();
    } else {
      this.loading = true; // Add this line
      FormValidations.hapshPassword(
        this.formulario.value.senha,
        12,
        (err, hash) => {
          if (err) {
            // throw and error
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível criptografar a senha, tente novamente!'
            });
            this.loading = false;
          } else {
            // store the new hash in the database etc
            this.adicionarUsuario(hash);
            this.loading = false; // Add this line
          }
        }
      );
    }
  }

  private trataDadosParaSalvar() {
    console.log(this.formulario);

    let valueSubmit = Object.assign({}, this.formulario.value);
    console.log(valueSubmit);

    valueSubmit = Object.assign(valueSubmit, {
      grupos: valueSubmit.grupos
        .map((v, i) => (v ? this.grupos[i] : null))
        .filter(v => v !== null)
    });
    return valueSubmit;
  }

  private pegaDadosFormulario(senahaCriptografada: string) {
    const valueSubmit = this.trataDadosParaSalvar();
    // this.usuario = valueSubmit;
    console.log(valueSubmit);

    this.usuario.nome = valueSubmit.nome;
    this.usuario.sobreNome = valueSubmit.sobreNome;
    this.usuario.email = valueSubmit.email;
    this.usuario.dataNascimento = valueSubmit.dataNascimento;
    this.usuario.senha = senahaCriptografada;

    const novaLista = [];

    for (const grupo of valueSubmit.grupos) {
      console.log('Grupo -> ', grupo);
      novaLista.push(grupo);
    }
    this.usuario.grupos = novaLista;
  }

  adicionarUsuario(senahaCriptografada: string) {
    // pega os dados do form
    this.pegaDadosFormulario(senahaCriptografada);

    console.log('this.usuario.grupos>> ', this.usuario.grupos);

    this.usuarioService
      .adicionar(this.usuario)
      .then(usuarioAdicionado => {
        this.messageService.add({
          severity: 'success',
          detail: 'Usuário adicionado com sucesso!'
        });

        this.router.navigate(['/usuarios', usuarioAdicionado.codigo]);

        this.loading = false;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  atualizarUsuario() {
    this.loading = true;

    const dadosFormulario = this.trataDadosParaSalvar();

    // const dadosFormulario = this.formulario.value;

    this.usuario.nome = dadosFormulario.nome;
    this.usuario.sobreNome = dadosFormulario.sobreNome;
    this.usuario.dataNascimento = dadosFormulario.dataNascimento;

    const novaLista = [];
    console.log('Grupo grupo:: ', dadosFormulario.grupos);
    for (const grupo of dadosFormulario.grupos) {
      console.log('Grupo -> ', grupo);
      novaLista.push(grupo);
    }
    this.usuario.grupos = novaLista;

    this.usuarioService
      .atualizar(this.usuario)
      .then(usuario => {
        this.usuario = usuario;

        this.messageService.add({
          severity: 'success',
          detail: 'Usuário alterado com sucesso!'
        });

        this.refazaConsulta();
        this.loading = false;
      })
      .catch(erro => {
        this.loading = false;
        this.errorHandler.handle(erro);
      });
  }

  novo() {
    this.resetar();
    setTimeout(
      function() {
        this.usuario = new Usuario();
      }.bind(this),
      1
    );

    this.router.navigate(['/usuarios/novo']);
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Edição de usuário: ${this.usuario.nome}`);
  }

  get editando() {
    return Boolean(this.formulario.get('codigo').value);
  }

  get codigoBom() {
    return Boolean(this.meuCodigo);
  }

  // Propriedades do formulário que vamos utilizar para obter os erros
  get nome() {
    return this.formulario.get('nome');
  }

  get sobreNome() {
    return this.formulario.get('sobreNome');
  }
  get email() {
    return this.formulario.get('email');
  }
  get confirmaEmail() {
    return this.formulario.get('confirmaEmail');
  }

  get dataNascimento() {
    return this.formulario.get('dataNascimento');
  }

  get senha() {
    return this.formulario.get('senha');
  }

  get confirmaSenha() {
    return this.formulario.get('confirmaSenha');
  }

  get grupoFormArray(): FormArray {
    return this.formulario.get('grupos') as FormArray;
  }

  get senhaError() {
    return this.formulario.controls['senha'];
  }
  get confirmaSenhaError() {
    return this.formulario.controls['confirmaSenha'];
  }

  private validarEmail(formControl: FormControl): Promise<any> {
    return new Promise(resolve => {
      if (!this.editando) {
        resolve(this.doSomethingAsync(formControl.value));
      } else {
        resolve(null);
      }
    });
  }

  private doSomethingAsync(formControl: string): Promise<any> {
    return new Promise(resolve => {
      if (!this.codigoBom) {
        resolve(
          this.usuarioService
            .verificarEmail(formControl)
            .then(emailExiste => {
              return emailExiste ? { emailInvalido: true } : null;
            })
            .catch(erro => {
              console.log('Email já cadastrado na base de dados!!!! ');
              // this.errorHandler.handle(erro);
              this.messageService.add({
                severity: 'error',
                detail: 'Email já cadastrado na base de dados!'
              });
              return { emailInvalido: false };
            })
        );
      } else {
        //   this.formulario.controls.controls.setValue(null, { emitEvent: true });
        return { emailInvalido: null };
      }
    });
  }

  refazaConsulta() {
    this.resetar();
    this.carregarUsuario(this.meuCodigo);
    this.atualizarTituloEdicao();
  }

  ngOnDestroy() {
    this.resetar();
    console.log('Ng Destroy => REMOVE CADASTRAR USUARIO');
  }
}
