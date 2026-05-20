import { Component, inject, OnInit } from '@angular/core';
import { EmpresaService } from '../empresa.service';
import { Empresa } from '../empresa';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cadastro',
  standalone: false,
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

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
  editingEmpresaId: number | null = null;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  ngOnInit(): void {
    
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
      },
      error: (err) => {
        this.openModal(err.error.status, err.error.messagem, 'error');
      }
    });
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

  closeModal(): void {
    this.showModal = false;
  }

  private openModal(title: string, message: string, type: 'success' | 'error'): void {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalType = type;
    this.showModal = true;
  }

  private onlyDigits(value: string | number | null | undefined): string {
    return String(value ?? '').replace(/\D/g, '');
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
}
