import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ProductModel } from 'src/app/shared/models/productModel';
import { AuthService } from 'src/app/shared/services';
import { ProductService } from 'src/app/shared/services/product.service';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
})
export class ProductsComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid!: DxDataGridComponent;
  userId!: string;
  product: ProductModel = this.createEmptyProduct();
  dataSource: ProductModel[] = [];
  selectedRowIndex: number = -1;
  unidadeMedidaDataSource = [
    { descricao: 'UN' },
    { descricao: 'KG' },
    { descricao: 'L' },
    { descricao: 'M' },
    { descricao: 'PC' },
    { descricao: 'CX' },
  ];

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  createEmptyProduct() {
    return {
      codigo: 0,
      referencias: '',
      codigosBarras: '',
      descricao: '',
      markup: 0,
      unidadeMedida: '',
      valorCusto: 0,
      valorVenda: 0,
      quantidadeEstoque: 0,
    };
  }

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
    this.generateCode();
  }

  async generateCode() {
    try {
      const lastProduct = await this.productService
        .getLastProduct(this.userId!)
        .toPromise();
      console.log('lastProduct:', lastProduct);
      this.product.codigo = lastProduct ? lastProduct.codigo + 1 : 1;
      console.log('this.product.codigo:', this.product.codigo);
    } catch (error) {
      console.error('Erro ao gerar o código do produto:', error);
    }
  }

  async loadData() {
    try {
      this.dataSource = (await this.productService
        .getProductByUserId(this.userId)
        .toPromise()) as ProductModel[];
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
  }

  async addProduct() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
  }

  async editProduct() {
    this.grid.instance.editRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async deleteProduct() {
    this.grid.instance.deleteRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async onRowInserted(event: DxDataGridTypes.RowInsertedEvent) {
    try {
      const newProduct = event.data;
      const valorVenda = this.valorVenda(
        newProduct.markup,
        newProduct.valorCusto
      );
      this.product = {
        userId: this.userId,
        codigo: this.product.codigo,
        referencias: newProduct.referencias,
        codigosBarras: newProduct.codigosBarras,
        descricao: newProduct.descricao,
        markup: newProduct.markup,
        unidadeMedida: newProduct.unidadeMedida,
        valorCusto: newProduct.valorCusto,
        valorVenda: valorVenda,
        quantidadeEstoque: newProduct.quantidadeEstoque,
      };
      await this.productService.createProduct(this.product).toPromise();
      console.log('Produto adicionado:', newProduct);
      this.loadData();
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  }

  async onRowUpdated(event: DxDataGridTypes.RowUpdatedEvent) {
    try {
      const updatedProduct = event.data;
      const valorVenda = this.valorVenda(
        updatedProduct.markup,
        updatedProduct.valorCusto
      );
      this.product = {
        _id: updatedProduct._id,
        userId: this.userId,
        codigo: updatedProduct.codigo,
        referencias: updatedProduct.referencias,
        codigosBarras: updatedProduct.codigosBarras,
        descricao: updatedProduct.descricao,
        markup: updatedProduct.markup,
        unidadeMedida: updatedProduct.unidadeMedida,
        valorCusto: updatedProduct.valorCusto,
        valorVenda: valorVenda,
        quantidadeEstoque: updatedProduct.quantidadeEstoque,
      };
      await this.productService.updateProduct(this.product).toPromise();
      console.log('Produto atualizado:', this.product);
      this.loadData();
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
    }
  }

  async onRowRemoved(event: DxDataGridTypes.RowRemovedEvent) {
    try {
      const removedProduct = event.data;
      await this.productService.deleteProduct(removedProduct._id).toPromise();
      console.log('Produto removido:', removedProduct);
      this.loadData();
    } catch (error) {
      console.error('Erro ao remover o produto:', error);
    }
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }

  valorVenda(markup: number, valorCusto: number): number {
    if (markup > 0) {
      return (valorCusto * markup) / 100 + valorCusto;
    } else {
      return valorCusto;
    }
  }
}
