export interface SaleModel {
  _id?: string;
  userId: string;
  codigo: number;
  idCliente: string;
  dataEmissao: Date;
  status: string;
  titulo: string;
  dadosAdicionais: string;
  idEspecie: string;
  idCondicao: string;
  valorDesconto: number;
  valorFrete: number;
  valorOutrasDespesas: number;
  valorTotal: number;
  itens: SaleItemModel[];
  parcelas: SaleInstallmentModel[];
}

export interface SaleItemModel {
  idProduto: string;
  descricao: string;
  quantidade: number;
  unidadeMedida: string;
  valorDesconto: number;
  valorOutrasDespesas: number;
  valorFrete: number;
  valorUnitario: number;
  valorTotal: number;
  quantidadeEstoque?: number;
}

export interface SaleInstallmentModel {
  numeroParcela: number;
  dataVencimento: string;
  valorParcela: number;
}

export interface PayloadModel {
  itens: SaleItemModel[];
  isIncrement: boolean;
}
