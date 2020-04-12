import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormValidations } from './../../shared/form-validations';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { MessageService } from 'primeng/components/common/messageservice';


import { RecuperarSenha } from 'src/app/core/model';
import { LogoutService } from 'src/app/seguranca/logout.service';

import { Usuario, VeririfcationToken } from './../../core/model';
import { UsuarioService } from '../../shared/services/usuario.service';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { AuthService } from './../../seguranca/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-recuperar-senhas',
  templateUrl: './recuperar-senhas.component.html',
  styleUrls: ['./recuperar-senhas.component.css']
})
export class RecuperarSenhasComponent implements OnInit {

  verificationTokenGuardado = new VeririfcationToken();
  usuario = new Usuario();
  token: string;

  frmSignup: FormGroup;
  frmSignupSolicitar: FormGroup;

  loading = false; // Add this line

  constructor(
    private auth: AuthService,
    private errorHandler: ErrorHandlerService,
    private router: Router,
    private logoutService: LogoutService,
    private messageService: MessageService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private title: Title,
    private fbSolicitar: FormBuilder
  ) { }

  ngOnInit() {
    this.frmSignup = this.configurarFormulario();

    this.frmSignupSolicitar = this.createSignupFormSolicitar();

    this.token = this.router.url.substring(27);

    this.title.setTitle('Cadastrando nova senha');

    this.criandoSessaoDefault();

    if (this.token) {
      this.pesquisar();
    }
  }

  createSignupFormSolicitar(): FormGroup {
    return this.fbSolicitar.group({
      email: [
        null,
        Validators.compose([Validators.email, Validators.required])
      ],
      dataNascimento: [null, Validators.required]
    });
  }

  submitSolicitar() {
    this.recuperar();
  }

  configurarFormulario(): FormGroup {
    return this.fb.group(
      {
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
        confirmaSenha: [null, Validators.compose([Validators.required])]
      },
      {
        // check whether our password and confirm password match
        validator: FormValidations.passwordMatchValidator
      }
    );
  }

  pesquisar() {

    this.usuarioService
      .verificaTokenValido(this.token)
      .then(resultado => {
        this.verificationTokenGuardado = resultado;
      })
      .catch(erro => {
          console.log('Redefinindo a senha!!!! ', erro);
        this.errorHandler.handle(erro);
      });
  }

  get editando() {
    return Boolean(this.token);
  }

  carregarUsuario(codigo: number) {
    this.usuarioService
      .buscarPorCodigo(codigo)
      .then(usuario => {
        this.usuario = usuario;
        this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }


  salvar() {
    if (this.editando) {
      this.loading = true; // Add this line
      FormValidations.hapshPassword(
        this.frmSignup.value.senha,
        12,
        (err, hash) => {
          if (err) {
            // throw and error
            this.messageService.add({
              severity: 'error',
              detail: 'Não foi possível alterar a senha, tente novamente!'
            });
            this.loading = false;
          } else {
            // store the new hash in the database etc
            console.log('hash>> ', hash);
            this.atualizarUsuario(hash);
            this.loading = false; // Add this line
            this.logout();
            //    return hash;
          }
        }
      );
    } else {
      // this.adicionarUsuario();
    }
  }

  atualizarUsuario(resp: any[]) {
    if (resp !== null && resp !== undefined) {
      this.usuarioService
        .atualizarSenha(this.verificationTokenGuardado.codigo_usuario, resp)
        .then(() => {
          this.messageService.add({
            severity: 'success',
            detail: 'Senha alterada com sucesso!'
          });
          this.router.navigate(['/login']);
        })
        .catch(erro => this.errorHandler.handle(erro));
    } else {
      this.errorHandler.handle('error');
    }
  }

  atualizarTituloEdicao() {
    this.title.setTitle(`Criando nova senha`);
  }

  criandoSessaoDefault() {
    const dados = new RecuperarSenha();

    this.auth
      .login(dados.usuario, dados.senha)
      .then(() => console.log('Sessao criada com sucesso!'))
      .catch(erro => {
        this.errorHandler.handle(erro);
      });
  }

  recuperar() {
    this.loading = true; // Add this line
    const dados = this.frmSignupSolicitar.value;
    this.tentaRecuperar(dados.email, dados.dataNascimento);
  }

  private tentaRecuperar(email: string, dataNascimento: Date) {

    this.usuarioService
      .recuperarSenha(email, moment(dataNascimento).format('YYYY-MM-DD'))
      .then(() => {
        this.loading = false; // Add this line
        this.messageService.add({
          severity: 'success',
          detail:
            'Instruções de recuperação enviado com sucesso para o Email informado !'
        });
        this.logout();
      })
      .catch(erro => {
        console.log( 'erro na solicitação de recuperar senha', erro );
       this.loading = false;  this.errorHandler.handle(erro);
       this.logout();
      } );
  }

  private logout() {
    this.logoutService
      .logout()
      .then(() => {
          this.router.navigate(['/login']);
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

  get senha() {
    return this.frmSignup.get('senha');
  }

  get confirmaSenha() {
    return this.frmSignup.get('confirmaSenha');
  }

  get email() {
    return this.frmSignupSolicitar.get('email');
  }


  get dataNascimento() {
    return this.frmSignupSolicitar.get('dataNascimento');
  }

  get senhaError() {
    return this.frmSignup.controls['senha'];
  }
  get confirmaSenhaError() {
    return this.frmSignup.controls['confirmaSenha'];
  }

}
