const packageJson = require('../../package.json');


export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',

  tokenWhitelistedDomains: [ new RegExp('localhost:8080') ],
  tokenBlacklistedRoutes: [ new RegExp('\/oauth\/token') ],
  i18nPrefix: '',


  appName: 'Gerenciador Financeiro',
  envName: 'DEV',
  test: false,
  versions: {
    app: packageJson.version,
    angular: packageJson.dependencies['@angular/core'],
    ngrx: packageJson.dependencies['@ngrx/store'],
    material: packageJson.dependencies['@angular/material'],
    bootstrap: packageJson.dependencies.bootstrap,
    rxjs: packageJson.dependencies.rxjs,
    ngxtranslate: packageJson.dependencies['@ngx-translate/core'],
    fontAwesome:
      packageJson.dependencies['@fortawesome/fontawesome-free-webfonts'],
    angularCli: packageJson.devDependencies['@angular/cli'],
    typescript: packageJson.devDependencies['typescript']
  }

};
