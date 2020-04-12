import { CategoriaService } from '../../shared/services/categoria.service';
import { Categoria } from './../../core/model';
import { MessageService } from 'primeng/components/common/messageservice';
import { ErrorHandlerService } from './../../core/error-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categoria-cadastro',
  templateUrl: './categoria-cadastro.component.html',
  styleUrls: ['./categoria-cadastro.component.css']
})

export class CategoriaCadastroComponent extends BaseFormComponent implements OnInit {

  formulario: FormGroup;
  categoria = new Categoria();

  constructor(
    private formBuilder: FormBuilder,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router,
    private errorHandler: ErrorHandlerService,
    private messageService: MessageService,
    private categoriaService: CategoriaService
  ) {
    super();
  }

  ngOnInit() {
    const codigoCategoria = this.route.snapshot.params['codigo'];

    this.title.setTitle('Nova categoria');

    if (codigoCategoria) {
       this.carregarCategoria(codigoCategoria);
    }

    this.configurarFormulario();

  }

  configurarFormulario() {
    this.formulario =  this.formBuilder.group({

      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(35)]]

    });

  }

  get editando() {
    return Boolean(this.categoria.codigo);
  }

  carregarCategoria(codigo: number) {
    this.categoriaService.buscarPorCodigo(codigo)
      .then(categoria => {

      // this.catoriaVelha = categoria;

      this.formulario.patchValue(categoria);

      this.categoria = categoria;

      this.atualizarTituloEdicao();
      })
      .catch(erro => this.errorHandler.handle(erro));
  }

submit() {
  if (this.editando) {
   this.atualizarCategoria();
 } else {
   this.adicionarCategoria();
 }
}

adicionarDadosFormulario() {
 const dadosFormulario = this.formulario.value;
 this.categoria.nome = dadosFormulario.nome;
}

adicionarCategoria() {

this.adicionarDadosFormulario();

console.log('Categoria::: ', this.categoria);
 this.categoriaService.adicionar(this.categoria)
   .then(categoriaAdicionada => {
     this.messageService.add({ severity: 'success', detail: 'Categoria adicionada com sucesso!' });
     this.router.navigate(['/categorias', categoriaAdicionada.codigo]);
   })
   .catch(erro => this.errorHandler.handle(erro));
}

atualizarCategoria() {

this.adicionarDadosFormulario();

 this.categoriaService.atualizar(this.categoria)
   .then(categoria => {
     this.categoria = categoria;

     this.messageService.add({ severity: 'success', detail: 'Categoria alterada com sucesso!' });
     this.atualizarTituloEdicao();
   })
   .catch(erro => {
    this.carregarCategoria(this.categoria.codigo);

    this.errorHandler.handle(erro);
    });
}

  nova() {
  this.formulario.reset();

  setTimeout(function() {
    this.categoria = new Categoria();
  }.bind(this), 1);

  this.router.navigate(['/categorias/nova']);
  }

  atualizarTituloEdicao() {
  this.title.setTitle(`Edição de categoria: ${this.categoria.nome}`);
  }
}
