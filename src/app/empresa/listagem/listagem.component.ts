import { Component, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';

@Component({
  selector: 'app-listagem',
  standalone: false,
  templateUrl: './listagem.component.html',
  styleUrl: './listagem.component.scss'
})
export class ListagemComponent implements OnInit {

  constructor(private service: EmpresaService) {}

  empresas: Empresa[] = [];
  editingEmpresaId: number | null = null;
  currentPage = 1;
  readonly pageSize = 5;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

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
    // const empresaApi = empresa as Empresa & { nomeFantasia?: string; id?: number | string };
    // this.editingEmpresaId = Number(empresaApi.id ?? 0);
    // this.form.patchValue({
    //   documento: this.formatCnpj(this.onlyDigits("324324")),
    //   nomeFantasia: empresaApi.fantasia ?? empresaApi.nomeFantasia ?? '',
    //   cep: this.formatCep(this.onlyDigits(empresaApi.cep))
    // });
    // this.currentView = 'cadastro';
    // this.router.navigate(['/empresa/cadastro']);
  }

  remover(empresa: Empresa): void {
    this.service.remover(empresa.id).subscribe({
      next: () => {
        this.empresas = this.empresas.filter((item) => item.id !== empresa.id);
        this.adjustCurrentPage();
        this.openModal('Remocao realizada', 'Empresa removida com sucesso.', 'success');
      },
      error: () => {
        this.openModal('Falha na remocao', 'Nao foi possivel remover a empresa. Tente novamente.', 'error');
      }
    });
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
}
