import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { MethodModel } from 'src/app/shared/models/methodModel';
import { AuthService } from 'src/app/shared/services';
import { PaymentMethodService } from 'src/app/shared/services/payment-method.service';

@Component({
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
})
export class PaymentMethodComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid: any;
  userId!: string;
  method: MethodModel = this.createEmptyMethod();
  dataSource: MethodModel[] = [];
  selectedRowIndex: number = -1;

  constructor(
    private methodService: PaymentMethodService,
    private authService: AuthService
  ) {}

  createEmptyMethod() {
    return {
      _id: '',
      descricao: '',
      userId: '',
    };
  }

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  async loadData() {
    try {
      this.dataSource = (await this.methodService
        .getPaymentMethodByUserId(this.userId)
        .toPromise()) as MethodModel[];
    } catch (error) {
      console.error('Erro ao carregar as Especies de Pagamento:', error);
    }
  }

  async addMethod() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
  }

  async editMethod() {
    this.grid.instance.editRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async deleteMethod() {
    this.grid.instance.deleteRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async onRowInserted(event: DxDataGridTypes.RowInsertedEvent) {
    try {
      const newMethod = event.data;
      (this.method = {
        descricao: newMethod.descricao,
        userId: this.userId,
      }),
        await this.methodService.createPaymentMethod(this.method).toPromise();
      console.log('Especie adicionada:', newMethod);
      this.loadData(); // Recarregar os dados para refletir a nova adição
    } catch (error) {
      console.error('Erro ao adicionar a Especie de Pagamento:', error);
    }
  }

  async onRowUpdated(event: DxDataGridTypes.RowUpdatedEvent) {
    try {
      const updateMethod = event.data;
      this.method = {
        _id: updateMethod._id,
        userId: this.userId,
        descricao: updateMethod.descricao,
      };
      await this.methodService.updatePaymentMethod(this.method).toPromise();
      console.log('Especie de Pagamento atualizada:', updateMethod);
      this.loadData(); // Recarregar os dados para refletir a atualização
    } catch (error) {
      console.error('Erro ao atualizar a Especie de Pagamento:', error);
    }
  }

  async onRowRemoved(event: DxDataGridTypes.RowRemovedEvent) {
    try {
      const removedMethod = event.data;
      await this.methodService
        .deletePaymentMethod(removedMethod._id)
        .toPromise();
      console.log('Especie de Pagamento removida:', removedMethod);
      this.loadData(); // Recarregar os dados para refletir a remoção
    } catch (error) {
      console.error('Erro ao remover a Especie de Pagamento:', error);
    }
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
}
