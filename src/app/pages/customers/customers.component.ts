import { Component, OnInit, ViewChild } from '@angular/core';
import { DxDataGridComponent } from 'devextreme-angular';
import { DxDataGridTypes } from 'devextreme-angular/ui/data-grid';
import { AuthService } from 'src/app/shared/services';
import { CustomerService } from 'src/app/shared/services/customer.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss']
})
export class CustomersComponent implements OnInit {
  @ViewChild(DxDataGridComponent, { static: false }) grid: any;
  userId!: string;
  customer: any = {
    codigo: '',
    cpfCnpj: '',
    rgIe: '',
    tipoPessoa: '',
    nomeRazaoSocial: '',
    apelidoNomeFantasia: '',
    endereco: {
      Cep: '',
      Logradouro: '',
      Numero: '',
      PontoReferencia: '',
      Bairro: '',
      Cidade: ''
    }
  };
  dataSource: any;
  selectedRowIndex: number = -1;

  constructor(
    private customerService: CustomerService,
    private authService: AuthService
  ) { }

  async ngOnInit(): Promise<void> {
    this.userId = (await this.authService.getUser()).data._id;
    this.loadData();
  }

  async loadData() {
    try {
      this.dataSource = await this.customerService.getCustomerByUserId(this.userId).toPromise();
    } catch (error) {
      console.error('Erro ao carregar os clientes:', error);
    }
  }

  async addCustomer() {
    this.grid.instance.addRow();
    this.grid.instance.deselectAll();
  }

  async editCustomer() {
    this.grid.instance.editRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async deleteCustomer() {
    this.grid.instance.deleteRow(this.selectedRowIndex);
    this.grid.instance.deselectAll();
  }

  async onRowInserted(event: any) {
    try {
      const newCustomer = event.data;
      this.customer = {
        codigo: newCustomer.codigo,
        cpfCnpj: newCustomer.cpfCnpj,
        rgIe: newCustomer.rgIe,
        tipoPessoa: newCustomer.tipoPessoa,
        nomeRazaoSocial: newCustomer.nomeRazaoSocial,
        apelidoNomeFantasia: newCustomer.apelidoNomeFantasia,
        endereco: {
          Cep: newCustomer.endereco.Cep,
          Logradouro: newCustomer.endereco.Logradouro,
          Numero: newCustomer.endereco.Numero,
          PontoReferencia: newCustomer.endereco.PontoReferencia,
          Bairro: newCustomer.endereco.Bairro,
          Cidade: newCustomer.endereco.Cidade
        },
        userId: this.userId
      };
      await this.customerService.createCustomer(this.customer).toPromise();
      console.log('Cliente adicionado:', newCustomer);
      this.loadData(); // Recarregar os dados para refletir a nova adição
    } catch (error) {
      console.error('Erro ao adicionar o cliente:', error);
    }
  }

  async onRowUpdated(event: any) {
    try {
      const updateCustomer = event.data;
      this.customer = {
        _id: updateCustomer._id,
        userId: this.userId,
        codigo: updateCustomer.codigo,
        cpfCnpj: updateCustomer.cpfCnpj,
        rgIe: updateCustomer.rgIe,
        tipoPessoa: updateCustomer.tipoPessoa,
        nomeRazaoSocial: updateCustomer.nomeRazaoSocial,
        apelidoNomeFantasia: updateCustomer.apelidoNomeFantasia,
        endereco: {
          Cep: updateCustomer.endereco.Cep,
          Logradouro: updateCustomer.endereco.Logradouro,
          Numero: updateCustomer.endereco.Numero,
          PontoReferencia: updateCustomer.endereco.PontoReferencia,
          Bairro: updateCustomer.endereco.Bairro,
          Cidade: updateCustomer.endereco.Cidade
        }
      };
      await this.customerService.updateCustomer(updateCustomer).toPromise();
      console.log('Cliente atualizado:', updateCustomer);
      this.loadData(); // Recarregar os dados para refletir a atualização
    } catch (error) {
      console.error('Erro ao atualizar o cliente:', error);
    }
  }

  async onRowRemoved(event: any) {
    try {
      const removedCustomer = event.data;
      await this.customerService.deleteCustomer(removedCustomer._id).toPromise();
      console.log('Cliente removido:', removedCustomer);
      this.loadData(); // Recarregar os dados para refletir a remoção
    } catch (error) {
      console.error('Erro ao remover o cliente:', error);
    }
  }

  selectedChanged(e: DxDataGridTypes.SelectionChangedEvent) {
    this.selectedRowIndex = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
  }
}
