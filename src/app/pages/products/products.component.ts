import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { DxSelectBoxTypes } from 'devextreme-angular/ui/select-box';
import config from 'devextreme/core/config';
import { AuthService } from 'src/app/shared/services';
import { ProductService } from 'src/app/shared/services/product.service';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';

@Component({
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})


export class ProductsComponent implements OnInit {
  
  @ViewChild(DxDataGridComponent, { static: false }) grid:any;
  userId!: string;
  product: any =  {
    userId: '',
    codigo: '',
    referencias: '',
    codigosBarras: '',
    descricao: '',
    unidadeMedida: '',
    valorCusto: 0,
    valorVenda: 0,
    quantidadeEstoque: 0
  };
  dataSource: any;
  selectedRowIndex: number = -1;


  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
     this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  async loadData() {
    try {
      
      this.dataSource = await this.productService.getProductByUserId(this.userId).toPromise();
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
  
  async onRowInserted(event: any) {
    try {
      const newProduct = event.data;
      this.product = {
        userId: this.userId,
        codigo: newProduct.codigo,
        referencias: newProduct.referencias,
        codigosBarras: newProduct.codigosBarras,
        descricao: newProduct.descricao,
        unidadeMedida: newProduct.unidadeMedida,
        valorCusto: newProduct.valorCusto,
        valorVenda: newProduct.valorVenda,
        quantidadeEstoque: newProduct.quantidadeEstoque
      };
      await this.productService.createProduct( this.product).toPromise();
      console.log('Produto adicionado:', newProduct);
      this.loadData(); // Recarregar os dados para refletir a nova adição
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error);
    }
  }

  async onRowUpdated(event: any) {
    try {
      const updatedProduct = event.data;
      this.product = {
        _id: updatedProduct._id,
        userId: this.userId,
        codigo: updatedProduct.codigo,
        referencias: updatedProduct.referencias,
        codigosBarras: updatedProduct.codigosBarras,
        descricao: updatedProduct.descricao,
        unidadeMedida: updatedProduct.unidadeMedida,
        valorCusto: updatedProduct.valorCusto,
        valorVenda: updatedProduct.valorVenda,
        quantidadeEstoque: updatedProduct.quantidadeEstoque
      };
      await this.productService.updateProduct( updatedProduct).toPromise();
      console.log('Produto atualizado:', updatedProduct);
      this.loadData(); // Recarregar os dados para refletir a atualização
    } catch (error) {
      console.error('Erro ao atualizar o produto:', error);
    }
  }
  
   
  async onRowRemoved(event: any) {
    try {
      const removedProduct = event.data;
      await this.productService.deleteProduct(removedProduct._id).toPromise();
      console.log('Produto removido:', removedProduct);
      this.loadData(); // Recarregar os dados para refletir a remoção
    } catch (error) {
      console.error('Erro ao remover o produto:', error);
    }
  }
  
  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }

}
