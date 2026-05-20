import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listagem',
  standalone: false,
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit {

  constructor(private service: EmpresaService, private router: Router) {}

  empresas: Empresa[] = [];
  editingEmpresaId: number | null = null;
  currentPage = 1;
  readonly pageSize = 5;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';
  showConfirmDeleteModal = false;
  empresaToDelete: Empresa | null = null;

  ngOnInit(): void {
    this.loadEmpresas();
  }

  private loadEmpresas(): void {

    this.service.listagem().subscribe({
      next: (data) => {
        this.empresas = data;
        this.adjustCurrentPage();
      }
    });
  }

  editar(empresa: Empresa): void {
    this.service.getById(empresa.id).subscribe({
      next: (empresaDetalhe) => {
        this.router.navigate(['/empresa/cadastro'], {
          state: { empresa: empresaDetalhe }
        });
      },
      error: () => {
        this.openModal('Falha ao carregar', 'Nao foi possivel carregar os dados da empresa para edicao.', 'error');
      }
    });
  }

  remover(empresa: Empresa): void {
    this.empresaToDelete = empresa;
    this.showConfirmDeleteModal = true;
  }

  confirmarRemocao(): void {
    if (!this.empresaToDelete) {
      this.showConfirmDeleteModal = false;
      return;
    }

    this.service.remover(this.empresaToDelete.id).subscribe({
      next: () => {
        this.empresas = this.empresas.filter((item) => item.id !== this.empresaToDelete?.id);
        this.adjustCurrentPage();
        this.showConfirmDeleteModal = false;
        this.empresaToDelete = null;
        this.openModal('Remocao realizada', 'Empresa removida com sucesso.', 'success');
      },
      error: () => {
        this.showConfirmDeleteModal = false;
        this.empresaToDelete = null;
        this.openModal('Falha na remocao', 'Nao foi possivel remover a empresa. Tente novamente.', 'error');
      }
    });
  }

  cancelarRemocao(): void {
    this.showConfirmDeleteModal = false;
    this.empresaToDelete = null;
  }

  get paginatedEmpresas(): Empresa[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.empresas.slice(start, start + this.pageSize);
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.empresas.length / this.pageSize));
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

    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  formatCep(value: string | number): string {
    const digits = this.onlyDigits(value).slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  private onlyDigits(value: string | number | null | undefined): string {
    return String(value ?? '').replace(/\D/g, '');
  }
}
