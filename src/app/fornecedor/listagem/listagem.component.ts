import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Fornecedor } from '../fornecedor';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-listagem',
  standalone: false,
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit {
  constructor(private service: FornecedorService, private router: Router) {}

  fornecedores: Fornecedor[] = [];
  fornecedoresFiltrados: Fornecedor[] = [];
  currentPage = 1;
  readonly pageSize = 5;
  filtroBusca: 'documento' | 'nome' = 'documento';
  termoBusca = '';
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';
  showConfirmDeleteModal = false;
  fornecedorToDelete: Fornecedor | null = null;

  ngOnInit(): void {
    this.loadFornecedores();
  }

  private loadFornecedores(): void {
    this.service.listagem().subscribe({
      next: (data) => {
        this.fornecedores = data;
        this.fornecedoresFiltrados = [...data];
        this.adjustCurrentPage();
      }
    });
  }

  onFiltroBuscaChange(): void {
    this.termoBusca = '';
    this.buscar();
  }

  onTermoBuscaInput(valor: string): void {
    if (this.filtroBusca !== 'documento') {
      this.termoBusca = valor;
      return;
    }

    const digitos = this.onlyDigits(valor).slice(0, 14);
    this.termoBusca = digitos.length <= 11
      ? this.formatCpf(digitos)
      : this.formatCnpj(digitos);
  }

  buscar(): void {
    const termo = this.termoBusca.trim();

    if (!termo) {
      this.fornecedoresFiltrados = [...this.fornecedores];
      this.currentPage = 1;
      this.adjustCurrentPage();
      return;
    }

    if (this.filtroBusca === 'documento') {
      const termoDigitos = this.onlyDigits(termo);
      this.fornecedoresFiltrados = this.fornecedores.filter((fornecedor) =>
        this.onlyDigits(fornecedor.documento).includes(termoDigitos)
      );
    } else {
      const termoNormalizado = termo.toLowerCase();
      this.fornecedoresFiltrados = this.fornecedores.filter((fornecedor) =>
        fornecedor.nome.toLowerCase().includes(termoNormalizado)
      );
    }

    this.currentPage = 1;
    this.adjustCurrentPage();
  }

  editar(fornecedor: Fornecedor): void {
    this.service.getById(fornecedor.id).subscribe({
      next: (fornecedorDetalhe) => {
        this.router.navigate(['/fornecedor/cadastro'], {
          state: { fornecedor: fornecedorDetalhe }
        });
      },
      error: () => {
        this.openModal('Falha ao carregar', 'Nao foi possivel carregar os dados do fornecedor para edicao.', 'error');
      }
    });
  }

  remover(fornecedor: Fornecedor): void {
    this.fornecedorToDelete = fornecedor;
    this.showConfirmDeleteModal = true;
  }

  confirmarRemocao(): void {
    if (!this.fornecedorToDelete) {
      this.showConfirmDeleteModal = false;
      return;
    }

    this.service.remover(this.fornecedorToDelete.id).subscribe({
      next: () => {
        this.fornecedores = this.fornecedores.filter((item) => item.id !== this.fornecedorToDelete?.id);
        this.buscar();
        this.adjustCurrentPage();
        this.showConfirmDeleteModal = false;
        this.fornecedorToDelete = null;
        this.openModal('Remocao realizada', 'Fornecedor removido com sucesso.', 'success');
      },
      error: () => {
        this.showConfirmDeleteModal = false;
        this.fornecedorToDelete = null;
        this.openModal('Falha na remocao', 'Nao foi possivel remover o fornecedor. Tente novamente.', 'error');
      }
    });
  }

  cancelarRemocao(): void {
    this.showConfirmDeleteModal = false;
    this.fornecedorToDelete = null;
  }

  get paginatedFornecedores(): Fornecedor[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.fornecedoresFiltrados.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.fornecedoresFiltrados.length / this.pageSize));
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage += 1;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage -= 1;
    }
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

  private adjustCurrentPage(): void {
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }

    if (this.currentPage < 1) {
      this.currentPage = 1;
    }
  }

  formatDocumento(value: string | number): string {
    const digits = this.onlyDigits(value).slice(0, 14);

    if (digits.length <= 11) {
      return this.formatCpf(digits);
    }

    return this.formatCnpj(digits);
  }

  formatCep(value: string | number): string {
    const digits = this.onlyDigits(value).slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  isPessoaFisica(documento: string | number): boolean {
    return this.onlyDigits(documento).length === 11;
  }

  formatDataNascimento(value: string | null | undefined): string {
    if (!value) {
      return '-';
    }

    const partes = value.split('-');

    if (partes.length === 3) {
      return `${partes[2]}/${partes[1]}/${partes[0]}`;
    }

    return value;
  }

  private onlyDigits(value: string | number | null | undefined): string {
    return String(value ?? '').replace(/\D/g, '');
  }

  private formatCpf(value: string): string {
    return value
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  private formatCnpj(value: string): string {
    return value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

}
