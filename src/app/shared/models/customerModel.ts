export interface CustomerModel {
  _id?: string;
  codigo: number;
  cpfCnpj: string;
  rgIe: string;
  tipoPessoa: string;
  nomeRazaoSocial: string;
  apelidoNomeFantasia: string;
  endereco?: AdressModel;
  userId?: string;
}

export interface AdressModel {
  cep: string;
  logradouro: string;
  numero: string;
  pontoReferencia: string;
  bairro: string;
  cidade: string;
}
