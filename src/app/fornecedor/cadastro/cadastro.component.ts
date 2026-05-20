import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fornecedor } from '../fornecedor';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  salvando = false;
  editingFornecedorId: number | null = null;
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

  ngOnInit(): void {
    const fornecedorState = history.state?.fornecedor as Fornecedor | undefined;

    if (!fornecedorState) {
      return;
    }

    this.populateFormForEdit(fornecedorState);
  }

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

    if (this.editingFornecedorId !== null) {
      this.fornecedorService.atualizar(this.editingFornecedorId, payload).subscribe({
        next: () => {
          this.salvando = false;
          this.editingFornecedorId = null;
          this.limparFormulario();
          this.openModal('Atualizacao realizada', 'Fornecedor atualizado com sucesso.', 'success');
          this.router.navigate(['/fornecedor/listagem']);
        },
        error: (err) => {
          this.salvando = false;
          this.openModal(err?.error?.status ?? 'Falha na atualizacao', err?.error?.messagem ?? 'Nao foi possivel atualizar o fornecedor.', 'error');
        }
      });
      return;
    }

    this.fornecedorService.criar(payload).subscribe({
      next: () => {
        this.salvando = false;
        this.limparFormulario();
        this.openModal('Cadastro realizado', 'Fornecedor cadastrado com sucesso.', 'success');
      },
      error: (err) => {
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

  private populateFormForEdit(fornecedor: Fornecedor): void {
    this.editingFornecedorId = fornecedor.id;
    this.fornecedor = {
      cep: this.formatCep(this.somenteDigitos(fornecedor.cep)),
      nome: fornecedor.nome,
      email: fornecedor.email ?? '',
      documento: this.formatDocumento(this.somenteDigitos(fornecedor.documento)),
      dataNascimento: fornecedor.nascimento ?? '',
      rg: fornecedor.rg ?? ''
    };
  }

  private formatDocumento(valor: string): string {
    return valor.length <= 11
      ? this.aplicarMascaraCpf(valor)
      : this.aplicarMascaraCnpj(valor);
  }

  private formatCep(valor: string): string {
    return valor.replace(/^(\d{5})(\d)/, '$1-$2');
  }

}
