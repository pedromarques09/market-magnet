export interface ProductModel {
  _id?: string;
  codigo: number;
  referencias: string;
  codigosBarras: string;
  descricao: string;
  markup: number;
  unidadeMedida: string;
  valorCusto: number;
  valorVenda: number;
  quantidadeEstoque: number;
  userId?: string;
}
