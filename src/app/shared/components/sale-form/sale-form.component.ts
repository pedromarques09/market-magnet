import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SaleService } from 'src/app/shared/services/sale.service';
import { CustomerService } from 'src/app/shared/services/customer.service';
import { PaymentConditionService } from 'src/app/shared/services/payment-condition.service';
import { PaymentMethodService } from 'src/app/shared/services/payment-method.service';
import { ProductService } from 'src/app/shared/services/product.service';
import {
  DxButtonModule,
  DxDataGridComponent,
  DxDataGridModule,
  DxDateBoxModule,
  DxFormModule,
  DxNumberBoxModule,
  DxSelectBoxModule,
  DxTextBoxModule,
} from 'devextreme-angular';
import { AuthService } from '../../services';
import { CommonModule } from '@angular/common';
import {
  PayloadModel,
  SaleInstallmentModel,
  SaleItemModel,
  SaleModel,
} from '../../models/saleModel';
import { ValidationCallbackData } from 'devextreme/common';
import { CustomerModel } from '../../models/customerModel';
import { MethodModel } from '../../models/methodModel';
import { ConditionModel } from '../../models/conditionModel';
import { ProductModel } from '../../models/productModel';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';

@Component({
  selector: 'app-sale-form',
  templateUrl: './sale-form.component.html',
  styleUrls: ['./sale-form.component.scss'],
})
export class SaleFormComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false })
  selectedProductGrid!: DxDataGridComponent;
  loading = false;
  sale: SaleModel = this.createEmptySale();
  payload!: PayloadModel;
  clientes: CustomerModel[] = [];
  especies: MethodModel[] = [];
  condicoes: ConditionModel[] = [];
  isEditMode: boolean = false;
  userId!: string;
  products: ProductModel[] = [];
  selectedProducts: SaleItemModel[] = [];
  isFinancialGenerated: boolean = false;
  selectedRowIndex: number = -1;
  saleId!: string;
  closedSale: boolean = false;
  isExistingSale: boolean = false;

  constructor(
    private saleService: SaleService,
    private customerService: CustomerService,
    private paymentMethodService: PaymentMethodService,
    private paymentConditionService: PaymentConditionService,
    private productService: ProductService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser())?.data._id;
    await this.loadClientes();
    await this.loadEspecies();
    await this.loadCondicoes();
    await this.loadProducts();
    await this.loadInitialData();
    await this.generateCode();
  }

  createEmptySale(): SaleModel {
    return {
      userId: '',
      codigo: 0,
      idCliente: '',
      dataEmissao: new Date(),
      status: 'Aberto',
      titulo: 'Venda',
      dadosAdicionais: '',
      idEspecie: '',
      idCondicao: '',
      valorDesconto: 0,
      valorFrete: 0,
      valorOutrasDespesas: 0,
      valorTotal: 0,
      itens: [],
      parcelas: [],
    };
  }

  confirmTotalValue = (e: ValidationCallbackData) => {
    return e.value !== 0;
  };

  async loadInitialData() {
    this.route.queryParams.subscribe(
      (params) => (this.saleId = params['saleId'])
    );

    if (this.saleId) {
      this.isEditMode = true;
      console.log('Edit mode active, loading sale data for user:', this.userId);
    }
    if (this.isEditMode) {
      try {
        const sale = await this.saleService
          .getSaleById(this.saleId)
          .toPromise();

        if (sale) {
          this.sale = sale;
          this.selectedProducts = this.sale.itens;
          this.isFinancialGenerated = true;
          this.closedSale = true;
        }
      } catch (error) {
        console.error('Erro ao carregar a venda:', error);
      }
      this.updateStockGrid();
    }
  }

  async generateCode() {
    if (!this.isEditMode) {
      try {
        const lastSale: SaleModel | undefined = await this.saleService
          .getLastSale(this.userId!)
          .toPromise();
        this.sale.codigo = lastSale ? lastSale.codigo + 1 : 1;
      } catch (error) {
        console.error('Erro ao gerar o código da venda:', error);
      }
    }
  }

  async loadProducts() {
    try {
      this.products = (await this.productService
        .getProductByUserId(this.userId!)
        .toPromise()) as ProductModel[];
    } catch (error) {
      console.error('Erro ao carregar  os itens:', error);
    }
  }

  async loadClientes() {
    try {
      this.clientes = (await this.customerService
        .getCustomerByUserId(this.userId!)
        .toPromise()) as CustomerModel[];
    } catch (error) {
      console.error('Erro ao carregar os clientes:', error);
    }
  }

  async loadEspecies() {
    try {
      this.especies = (await this.paymentMethodService
        .getPaymentMethodByUserId(this.userId!)
        .toPromise()) as MethodModel[];
    } catch (error) {
      console.error('Erro ao carregar as espécies:', error);
    }
  }

  async loadCondicoes() {
    try {
      this.condicoes = (await this.paymentConditionService
        .getPaymentConditionByUserId(this.userId!)
        .toPromise()) as ConditionModel[];
    } catch (error) {
      console.error('Erro ao carregar as condições:', error);
    }
  }

  addProduct(product: any) {
    const existingProduct = this.selectedProducts.find(
      (element: any) => element.descricao === product.descricao
    );
    if (existingProduct) {
      existingProduct.quantidade++;
      existingProduct.valorTotal =
        existingProduct.quantidade * existingProduct.valorUnitario;
    } else {
      const newProduct = {
        idProduto: product._id,
        descricao: product.descricao,
        quantidade: 1,
        unidadeMedida: product.unidadeMedida,
        valorUnitario: product.valorVenda,
        valorTotal: product.valorVenda,
        valorDesconto: 0,
        valorFrete: 0,
        valorOutrasDespesas: 0,
        quantidadeEstoque: product.quantidadeEstoque,
      };
      this.selectedProducts.push(newProduct);
    }
    this.calculateTotal();
    if (this.selectedProductGrid && this.selectedProductGrid.instance) {
      this.selectedProductGrid.instance.deselectAll();
    }
  }

  updateStockGrid() {
    this.selectedProducts.forEach((product: any) => {
      const selectedProduct: any = this.products.find(
        (p: any) => p._id === product.idProduto
      );
      product.quantidadeEstoque = selectedProduct.quantidadeEstoque;
    });
  }

  onSelectionChanged(event: DxDataGridTypes.SelectionChangedEvent) {
    const selectedProduct = event.selectedRowsData[0];
    if (selectedProduct) {
      this.addProduct(selectedProduct);
    }
  }

  updateProduct(event: DxDataGridTypes.RowUpdatedEvent) {
    const product = event.data;
    product.valorTotal = (
      product.quantidade * product.valorUnitario -
      product.valorDesconto +
      product.valorFrete +
      product.valorOutrasDespesas
    ).toFixed(2);

    this.calculateTotal();
  }

  calculateTotal() {
    let total: number = 0;
    this.selectedProducts.forEach((product: { valorTotal: number }) => {
      total += product.valorTotal;
    });
    this.sale.valorTotal = parseFloat(
      (
        total +
        (parseFloat(this.sale.valorFrete.toString()) || 0) +
        (parseFloat(this.sale.valorOutrasDespesas.toString()) || 0) -
        (parseFloat(this.sale.valorDesconto.toString()) || 0)
      ).toFixed(2)
    );
  }

  generateFinancial() {
    const condicao = this.condicoes.find(
      (c: any) => c._id === this.sale.idCondicao
    );
    if (!condicao) {
      console.error('Condição de pagamento não encontrada.');
      return;
    }

    const parcelas: SaleInstallmentModel[] = [];
    let valorParcela: number = parseFloat(
      (this.sale.valorTotal / condicao.numeroParcela).toFixed(2)
    );
    let dataVencimento = new Date(this.sale.dataEmissao);
    dataVencimento.setDate(dataVencimento.getDate() + condicao.diasEntrada);
    let valorParcial = 0;
    for (let i = 1; i <= condicao.numeroParcela; i++) {
      if (i == condicao.numeroParcela) {
        valorParcela = parseFloat(
          (this.sale.valorTotal - valorParcial).toFixed(2)
        );
      }
      parcelas.push({
        numeroParcela: i,
        valorParcela: valorParcela,
        dataVencimento: dataVencimento.toLocaleDateString('pt-BR'),
      });
      dataVencimento.setDate(dataVencimento.getDate() + condicao.diasIntervalo);
      valorParcial += valorParcela;
    }

    this.sale.parcelas = parcelas;
    this.isFinancialGenerated = true;
  }

  onSubmit() {
    if (this.isFinancialGenerated) {
      this.isFinancialGenerated = false;
    } else {
      this.generateFinancial();
    }
  }

  finalizeSale = async () => {
    if (this.closedSale) {
      const confirmOpen = confirm(
        'Se voce reabrir sua venda o estoque dos seus itens voltara como era antes, tem certeza que quer continuar?'
      );
      if (!confirmOpen) {
        return;
      }
      this.payload = {
        itens: this.selectedProducts,
        isIncrement: true,
      };
      await this.productService.updateStock(this.payload).toPromise();
      this.sale.status = 'Aberto';
      this.closedSale = false;
      await this.loadProducts();
      await this.updateStockGrid();
      this.isExistingSale = true;
      return;
    }
    if (!this.isFinancialGenerated) {
      alert('É necessário gerar o financeiro antes de finalizar a venda.');
      return;
    }
    const hasNegativeStock = this.selectedProducts.some(
      (product: SaleItemModel) => {
        const selectedProduct: any = this.products.find(
          (p: ProductModel) => p._id === product.idProduto
        );
        const selectedProductQuantity = selectedProduct.quantidadeEstoque;
        const requestedQuantity = product.quantidade;
        return selectedProductQuantity < requestedQuantity;
      }
    );

    if (hasNegativeStock) {
      const confirmSale = confirm(
        'Existem produtos com estoque menor que o desejado pela compra. Deseja continuar com a venda?'
      );
      if (!confirmSale) {
        return;
      }
    }

    this.sale = {
      ...this.sale,
      userId: this.userId!,
      itens: this.selectedProducts,
    };
    this.payload = {
      itens: this.selectedProducts,
      isIncrement: false,
    };
    try {
      this.sale.status = 'Fechada';
      this.productService.updateStock(this.payload).toPromise();
      if (this.isEditMode) {
        this.saleService.updateSale(this.sale).toPromise();
      } else {
        this.saleService.createSale(this.sale).toPromise();
      }
      this.router.navigate(['/sales']);
    } catch (error) {
      this.loading = false;
      this.sale.status = 'Aberta';
      console.error('Erro ao salvar a venda:', error);
    }
  };

  cancel = () => {
    if (this.isExistingSale) {
      alert('Essa venda existente ficara salva com o status aberto.');
      this.saleService.updateSale(this.sale).toPromise();
    }
    this.router.navigate(['/sales']);
  };
}

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    DxTextBoxModule,
    DxSelectBoxModule,
    DxDateBoxModule,
    DxNumberBoxModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
  ],
  declarations: [SaleFormComponent],
  exports: [SaleFormComponent],
})
export class SaleFormModule {}
