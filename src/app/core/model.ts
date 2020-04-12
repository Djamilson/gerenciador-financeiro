export class Estado {
  codigo: number;
  nome: string;
  sigla: string;
}

export class RecuperarSenha {

  usuario = 'usuario.defalt@usuario.default.com';
  senha = '(*$.re10per45mn)';

}
export class Cidade {
  codigo: number;
  nome: string;
  estado: number;
}

export class PersistedPassword {
  salt: string;
  hash: string;
  iterations: number;
}

export class VeririfcationToken {
codigo: number;
token: string;
codigo_usuario: number;
expiryDate: string;
}


export class Endereco {
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  cidade = new Cidade();
}

export class Contato {
  codigo: number;
  nome: string;
  email: string;
  telefone: string;

  constructor(codigo?: number,
    nome?: string,
    email?: string,
    telefone?: string) {
      this.codigo = codigo;
      this.nome = nome;
      this.email = email;
      this.telefone = telefone;
  }
}

export class Pessoa {
  codigo: number;
  nome: string;
  endereco = new Endereco();
  ativo = true;
  contatos = new Array<Contato>();
}

export class Permissao {
  codigo: number;
  descricao: string;
}

export class Grupo {
  codigo: number;
  nome: string;
  descricao: string;
  permissoes = new Array<Permissao>();
}

export class Imagem {
  codigo: number;
  nome: string;
  caminho_s3: string;
  dataCad: Date;
  lancamento_codigo: number;
}

export class GrupoSemPermissao {
  codigo: number;
  nome: string;
  descricao: string;
}

export class Usuario {
  codigo: number;
  nome: string;
  sobreNome: string;
  ativo = true;
  email: string;
  senha: string;
  dataNascimento: Date;
  grupos = new Array<Grupo>();
}

export class Categoria {
  codigo: number;
  nome: string;
}

export class Lancamento {
  codigo: number;
  tipo = 'RECEITA';
  descricao: string;
  numeroLancamento: string;
  dataVencimento: Date;
  dataPagamento: Date;
  dataCad: Date;
  dataBaixa: Date;
  dataUpdate: Date;
  valor: number;
  valorPagoRecebido: number;
  observacao: string;
  pessoa = new Pessoa();
  categoria = new Categoria();
  anexo: string;
  urlAnexo: string;
}

export class LancamentoTotal {
  totalReceitasMes: number;
  totalDespesasMes: number;
  totalReceitasDespesasMes: number;
}
