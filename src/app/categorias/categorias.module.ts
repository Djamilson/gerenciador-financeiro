import { SharedModule } from './../shared/shared.module';
import { CategoriasRoutingModule } from './categorias-routing.module';
import { NgModule } from '@angular/core';
import { CategoriasPesquisaComponent } from './categorias-pesquisa/categorias-pesquisa.component';
import { CategoriaCadastroComponent } from './categoria-cadastro/categoria-cadastro.component';

@NgModule({
  imports: [

    SharedModule,
    CategoriasRoutingModule
  ],
  declarations: [CategoriasPesquisaComponent, CategoriaCadastroComponent]
})
export class CategoriasModule { }
