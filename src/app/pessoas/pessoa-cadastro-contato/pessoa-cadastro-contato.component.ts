import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { Contato } from '../../core/model';

@Component({
  selector: 'app-pessoa-cadastro-contato',
  templateUrl: './pessoa-cadastro-contato.component.html',
  styleUrls: ['./pessoa-cadastro-contato.component.css'],
  preserveWhitespaces: true
})
export class PessoaCadastroContatoComponent implements OnInit {

  @Input() contatos: Array<Contato>;
  contato: Contato;
  exbindoFormularioContato = false;
  contatoIndex: number;
  cols: any[];

  constructor() { }

  ngOnInit() {
    this.cols = [
      { header: '#', class: 'col-data-header' },
      { header: 'Nome', class: 'col-data-header' },
      { header: 'Email', class: 'col-data-header' },
      { header: 'Fone', class: 'col-data-header' },
      { header: 'Ação', class: 'col-data-header' }
    ];
  }

  prepararNovoContato() {
    this.exbindoFormularioContato = true;
    this.contato = new Contato();
    this.contatoIndex = this.contatos.length;
  }

  prepararEdicaoContato(contato: Contato, index: number) {
    this.contato = this.clonarContato(contato);
    this.exbindoFormularioContato = true;
    this.contatoIndex = index;
  }

  confirmarContato(frm: FormControl) {
    this.contatos[this.contatoIndex] = this.clonarContato(this.contato);

    this.exbindoFormularioContato = false;

    frm.reset();
  }

  removerContato(index: number) {
    this.contatos.splice(index, 1);
  }

  clonarContato(contato: Contato): Contato {
    return new Contato(contato.codigo,
      contato.nome, contato.email, contato.telefone);
  }

  get editando() {
    return this.contato && this.contato.codigo;
  }

}
