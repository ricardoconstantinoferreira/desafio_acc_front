import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EmpresaService } from './empresa.service';
import { Empresa } from './empresa';

@Component({
  selector: 'app-empresa',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './empresa.component.html',
  styleUrl: './empresa.component.scss'
})
export class EmpresaComponent implements OnInit {

  constructor(private service: EmpresaService) {}

  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly form = this.fb.group({
    documento: ['', [Validators.required]],
    nomeFantasia: ['', [Validators.required]],
    cep: ['', [Validators.required]]
  });

  empresas: Empresa[] = [];
  currentView: 'cadastro' | 'listagem' = 'cadastro';
  editingEmpresaId: number | null = null;
  currentPage = 1;
  readonly pageSize = 5;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  private readonly storageKey = 'empresas-cadastro';

  ngOnInit(): void {
    this.loadEmpresas();

    this.route.data.subscribe((data) => {
      this.currentView = data['view'] === 'listagem' ? 'listagem' : 'cadastro';
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const documentoLimpo = this.onlyDigits(this.form.value.documento ?? '').slice(0, 14);
    const cepLimpo = this.onlyDigits(this.form.value.cep ?? '').slice(0, 8);

    const payload = {
      documento: documentoLimpo,
      fantasia: this.form.value.nomeFantasia ?? '',
      cep: cepLimpo
    };

    if (this.editingEmpresaId !== null) {
      this.service.atualizar(this.editingEmpresaId, payload).subscribe({
        next: () => {
          this.openModal('Atualizacao realizada', 'Empresa atualizada com sucesso.', 'success');
          this.editingEmpresaId = null;
          this.form.reset();
          this.loadEmpresas();
          this.router.navigate(['/empresa/listagem']);
        },
        error: () => {
          this.openModal('Falha na atualizacao', 'Nao foi possivel atualizar a empresa. Tente novamente.', 'error');
        }
      });
      return;
    }

    this.service.criar(payload).subscribe({
      next: () => {
        this.openModal('Cadastro realizado', 'Empresa cadastrada com sucesso.', 'success');
        this.form.reset();
        this.loadEmpresas();
      },
      error: (err) => {
        this.openModal(err.error.status, err.error.messagem, 'error');
      }
    });
  }

  editar(empresa: Empresa): void {
    this.editingEmpresaId = empresa.id;
    this.form.patchValue({
      documento: this.formatCnpj(this.onlyDigits(empresa.documento)),
      nomeFantasia: empresa.fantasia,
      cep: this.formatCep(this.onlyDigits(empresa.cep))
    });
    this.currentView = 'cadastro';
    this.router.navigate(['/empresa/cadastro']);
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

  onDocumentoInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numeros = this.onlyDigits(input.value).slice(0, 14);
    this.form.controls.documento.setValue(this.formatCnpj(numeros), { emitEvent: false });
  }

  onCepInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const numeros = this.onlyDigits(input.value).slice(0, 8);
    this.form.controls.cep.setValue(this.formatCep(numeros), { emitEvent: false });
  }

  private loadEmpresas(): void {

    this.service.listagem().subscribe({
      next: (data) => {
        this.empresas = data;
        this.adjustCurrentPage();
      }
    });
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

  private onlyDigits(value: string): string {
    return value.replace(/\D/g, '');
  }

  private formatCnpj(value: string): string {
    return value
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  private formatCep(value: string): string {
    return value.replace(/^(\d{5})(\d)/, '$1-$2');
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
