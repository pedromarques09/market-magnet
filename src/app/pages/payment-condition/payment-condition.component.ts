import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ConditionModel } from 'src/app/shared/models/conditionModel';
import { AuthService } from 'src/app/shared/services';
import { PaymentConditionService } from 'src/app/shared/services/payment-condition.service';

@Component({
  selector: 'app-payment-condition',
  templateUrl: './payment-condition.component.html',
  styleUrls: ['./payment-condition.component.scss'],
})
export class PaymentConditionComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid!: DxDataGridComponent;
  userId!: string;
  condition: ConditionModel = this.createEmptyCondition();
  dataSource: ConditionModel[] = [];
  selectedRowIndex: number = -1;

  constructor(
    private conditionService: PaymentConditionService,
    private authService: AuthService
  ) {}

  createEmptyCondition() {
    return {
      _id: '',
      descricao: '',
      numeroParcela: 0,
      diasIntervalo: 0,
      diasEntrada: 0,
      userId: '',
    };
  }

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  async loadData() {
    try {
      this.dataSource = (await this.conditionService
        .getPaymentConditionByUserId(this.userId)
        .toPromise()) as ConditionModel[];
    } catch (error) {
      console.error('Erro ao carregar as Condiçãos de Pagamento:', error);
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
      const newCondition = event.data;
      (this.condition = {
        descricao: newCondition.descricao,
        userId: this.userId,
        numeroParcela: newCondition.numeroParcela,
        diasIntervalo: newCondition.diasIntervalo,
        diasEntrada: newCondition.diasEntrada,
      }),
        await this.conditionService
          .createPaymentCondition(this.condition)
          .toPromise();
      console.log('Condição adicionada:', newCondition);
      this.loadData();
    } catch (error) {
      console.error('Erro ao adicionar a Condição de Pagamento:', error);
    }
  }

  async onRowUpdated(event: DxDataGridTypes.RowUpdatedEvent) {
    try {
      const updateCondition = event.data;
      this.condition = {
        _id: updateCondition._id,
        descricao: updateCondition.descricao,
        userId: this.userId,
        numeroParcela: updateCondition.numeroParcela,
        diasIntervalo: updateCondition.diasIntervalo,
        diasEntrada: updateCondition.diasEntrada,
      };
      await this.conditionService
        .updatePaymentCondition(this.condition)
        .toPromise();
      console.log('Condição de Pagamento atualizada:', updateCondition);
      this.loadData();
    } catch (error) {
      console.error('Erro ao atualizar a Condição de Pagamento:', error);
    }
  }

  async onRowRemoved(event: DxDataGridTypes.RowRemovedEvent) {
    try {
      const removedCondition = event.data;
      await this.conditionService
        .deletePaymentCondition(removedCondition._id)
        .toPromise();
      console.log('Condição de Pagamento removida:', removedCondition);
      this.loadData();
    } catch (error) {
      console.error('Erro ao remover a Condição de Pagamento:', error);
    }
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
}
