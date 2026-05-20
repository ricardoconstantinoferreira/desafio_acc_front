import { Component } from '@angular/core';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  fornecedor = {
    cep: '',
    nome: '',
    email: '',
    documento: '',
    dataNascimento: '',
    rg: ''
  };

  get documentoDigitos(): string {
    return this.somenteDigitos(this.fornecedor.documento);
  }

  get isCpfDocumento(): boolean {
    return this.documentoDigitos.length === 11;
  }

  onCepInput(valor: string): void {
    const digitos = this.somenteDigitos(valor).slice(0, 8);

    if (digitos.length <= 5) {
      this.fornecedor.cep = digitos;
      return;
    }

    this.fornecedor.cep = `${digitos.slice(0, 5)}-${digitos.slice(5)}`;
  }

  onDocumentoInput(valor: string): void {
    const digitos = this.somenteDigitos(valor).slice(0, 14);

    this.fornecedor.documento = digitos.length <= 11
      ? this.aplicarMascaraCpf(digitos)
      : this.aplicarMascaraCnpj(digitos);

    if (!this.isCpfDocumento) {
      this.fornecedor.dataNascimento = '';
      this.fornecedor.rg = '';
    }
  }

  abrirSeletorData(inputData: HTMLInputElement): void {
    if (typeof inputData.showPicker === 'function') {
      inputData.showPicker();
      return;
    }

    inputData.focus();
  }

  private somenteDigitos(valor: string): string {
    return valor.replace(/\D/g, '');
  }

  private aplicarMascaraCpf(valor: string): string {
    return valor
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  private aplicarMascaraCnpj(valor: string): string {
    return valor
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }

}
