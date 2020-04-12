
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private router: Router, translate: TranslateService) {
  // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('pt');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('pt');

  }

  exibindoNavbar() {
    // pega a rota para redefinicao de senha, ocultar o menu
    this.router.url.substring(0, 27);
    const recuperasenha = this.router.url.substring(0, 26);
    return this.router.url !== '/login' && recuperasenha !== '/usuarios/recuperar-senhas';
  }

}
