import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { ValidationCallbackData } from 'devextreme/common';
import { CustomerModel } from 'src/app/shared/models/customerModel';
import { AuthService } from 'src/app/shared/services';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
})
export class CustomersComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid!: DxDataGridComponent;
  userId!: string;
  customer: CustomerModel = this.createEmptyCustomer();
  tipoPessoaDataSource = [{ descricao: 'Fisica' }, { descricao: 'Juridica' }];
  dataSource: CustomerModel[] = [];
  selectedRowIndex: number = -1;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  createEmptyCustomer() {
    return {
      codigo: 0,
      cpfCnpj: '',
      rgIe: '',
      tipoPessoa: '',
      nomeRazaoSocial: '',
      apelidoNomeFantasia: '',
      endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        pontoReferencia: '',
        bairro: '',
        cidade: '',
      },
    };
  }

  async loadData() {
    try {
      this.dataSource = (await this.customerService
        .getCustomerByUserId(this.userId)
        .toPromise()) as CustomerModel[];
    } catch (error) {
      console.error('Erro ao carregar os clientes:', error);
    }
  }

  async addCustomer() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
    this.generateCode();
  }

  async editCustomer() {
    this.grid.instance.editRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async deleteCustomer() {
    this.grid.instance.deleteRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async generateCode() {
    try {
      const lastCostumer = await this.customerService
        .getLastCustomer(this.userId!)
        .toPromise();
      this.customer.codigo = lastCostumer ? lastCostumer.codigo + 1 : 1;
    } catch (error) {
      console.error('Erro ao gerar o código do cliente:', error);
    }
  }

  controlCpfCnpj(e: ValidationCallbackData) {
    return e.value.length == 11 || e.value.length == 14;
  }

  async onRowInserted(event: DxDataGridTypes.RowInsertedEvent) {
    try {
      const newCustomer = event.data;
      this.customer = {
        codigo: this.customer.codigo,
        cpfCnpj: newCustomer.cpfCnpj,
        rgIe: newCustomer.rgIe,
        tipoPessoa: newCustomer.tipoPessoa,
        nomeRazaoSocial: newCustomer.nomeRazaoSocial,
        apelidoNomeFantasia: newCustomer.apelidoNomeFantasia,
        endereco: {
          cep: newCustomer.endereco.cep,
          logradouro: newCustomer.endereco.logradouro,
          numero: newCustomer.endereco.numero,
          pontoReferencia: newCustomer.endereco.pontoReferencia,
          bairro: newCustomer.endereco.bairro,
          cidade: newCustomer.endereco.cidade,
        },
        userId: this.userId,
      };
      await this.customerService.createCustomer(this.customer).toPromise();
      this.loadData();
    } catch (error) {
      console.error('Erro ao adicionar o cliente:', error);
    }
  }

  async onRowUpdated(event: DxDataGridTypes.RowUpdatedEvent) {
    try {
      const updateCustomer = event.data;
      this.customer = {
        _id: updateCustomer._id,
        codigo: updateCustomer.codigo,
        cpfCnpj: updateCustomer.cpfCnpj,
        rgIe: updateCustomer.rgIe,
        tipoPessoa: updateCustomer.tipoPessoa,
        nomeRazaoSocial: updateCustomer.nomeRazaoSocial,
        apelidoNomeFantasia: updateCustomer.apelidoNomeFantasia,
        endereco: {
          cep: updateCustomer.endereco.cep,
          logradouro: updateCustomer.endereco.logradouro,
          numero: updateCustomer.endereco.numero,
          pontoReferencia: updateCustomer.endereco.pontoReferencia,
          bairro: updateCustomer.endereco.bairro,
          cidade: updateCustomer.endereco.cidade,
        },
        userId: this.userId,
      };
      await this.customerService.updateCustomer(updateCustomer).toPromise();
      this.loadData();
    } catch (error) {
      console.error('Erro ao atualizar o cliente:', error);
    }
  }

  async onRowRemoved(event: DxDataGridTypes.RowRemovedEvent) {
    try {
      const removedCustomer = event.data;
      await this.customerService
        .deleteCustomer(removedCustomer._id)
        .toPromise();
      this.loadData();
    } catch (error) {
      console.error('Erro ao remover o cliente:', error);
    }
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
}
