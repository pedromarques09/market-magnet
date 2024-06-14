import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/services';
import { SaleService } from 'src/app/shared/services/sale.service';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { SaleModel } from 'src/app/shared/models/saleModel';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
})
export class SalesComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid!: DxDataGridComponent;
  sales: SaleModel[] = [];
  selectedRowIndex: number = -1;
  userId!: string;

  constructor(
    private saleService: SaleService,
    private authService: AuthService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  async loadData() {
    try {
      this.sales = (await this.saleService
        .getSaleByUserId(this.userId)
        .toPromise()) as SaleModel[];
    } catch (error) {
      console.error('Erro ao carregar as vendas:', error);
    }
  }

  addSale() {
    this.router.navigate(['/sale-form']);
  }

  async onRowInserted(event: DxDataGridTypes.RowInsertedEvent) {
    try {
      const newSale = event.data;
      newSale.userId = this.userId;
      await this.saleService.createSale(newSale).toPromise();
      console.log('Venda adicionada:', newSale);
      this.loadData();
    } catch (error) {
      console.error('Erro ao adicionar a venda:', error);
    }
  }

  async onRowRemoved(event: DxDataGridTypes.RowRemovedEvent) {
    try {
      const removedSale = event.data;
      await this.saleService.deleteSale(removedSale._id).toPromise();
      console.log('Venda removida:', removedSale);
      this.loadData();
    } catch (error) {
      console.error('Erro ao remover a venda:', error);
    }
  }

  onSelectionChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    const selectedSale = e.selectedRowsData[0];
    if (selectedSale) {
      this.router.navigate(['/sale-form'], {
        queryParams: {
          saleId: selectedSale._id,
        },
      });
    }
  }
}
