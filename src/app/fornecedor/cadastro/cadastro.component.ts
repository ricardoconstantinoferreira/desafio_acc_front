import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  salvando = false;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  constructor(
    private readonly fornecedorService: FornecedorService,
    private readonly router: Router
  ) {}

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

  salvarFornecedor(): void {
    const documento = this.somenteDigitos(this.fornecedor.documento);
    const cep = this.somenteDigitos(this.fornecedor.cep);
    const nome = this.fornecedor.nome.trim();

    if (!documento || !cep || !nome) {
      return;
    }

    const payload = {
      documento,
      nome,
      cep,
      email: this.fornecedor.email.trim(),
      nascimento: this.isCpfDocumento ? this.fornecedor.dataNascimento : '',
      rg: this.isCpfDocumento ? this.fornecedor.rg.trim() : ''
    };

    this.salvando = true;

    this.fornecedorService.criar(payload).subscribe({
      next: () => {
        this.salvando = false;
        this.limparFormulario();
        this.openModal('Cadastro realizado', 'Fornecedor cadastrado com sucesso.', 'success');
      },
      error: (err) => {
        debugger;
        this.salvando = false;
        this.openModal(err.error.status, err.error.messagem, 'error');
      }
    });
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

  closeModal(): void {
    this.showModal = false;
  }

  private openModal(title: string, message: string, type: 'success' | 'error'): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  private limparFormulario(): void {
    this.fornecedor = {
      cep: '',
      nome: '',
      email: '',
      documento: '',
      dataNascimento: '',
      rg: ''
    };
  }

}
