import { Component, OnInit } from '@angular/core';
import { Empresa } from '../empresa';
import { EmpresaService } from '../empresa.service';
import { Fornecedor } from '../../fornecedor/fornecedor';

@Component({
  selector: 'app-fornecedores-por-empresas',
  standalone: false,
  templateUrl: './fornecedores-por-empresas.component.html',
  styleUrl: './fornecedores-por-empresas.component.scss'
})
export class FornecedoresPorEmpresasComponent implements OnInit {
  constructor(private readonly empresaService: EmpresaService) {}

  empresas: Empresa[] = [];
  fornecedores: Fornecedor[] = [];
  empresaIdSelecionada = '';
  carregandoEmpresas = false;
  carregandoFornecedores = false;

  ngOnInit(): void {
    this.carregarEmpresas();
  }

  onEmpresaChange(value: string): void {
    this.empresaIdSelecionada = value;

    if (!value) {
      this.fornecedores = [];
      return;
    }

    this.carregarFornecedoresPorEmpresa(Number(value));
  }

  formatDocumento(value: string | number): string {
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 14);

    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }

  formatCep(value: string | number): string {
    const digits = String(value ?? '').replace(/\D/g, '').slice(0, 8);
    return digits.replace(/^(\d{5})(\d)/, '$1-$2');
  }

  isPessoaFisica(documento: string | number): boolean {
    return String(documento ?? '').replace(/\D/g, '').length === 11;
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

  private carregarEmpresas(): void {
    this.carregandoEmpresas = true;

    this.empresaService.listagem().subscribe({
      next: (empresas) => {
        this.empresas = empresas;
        this.carregandoEmpresas = false;
      },
      error: () => {
        this.empresas = [];
        this.carregandoEmpresas = false;
      }
    });
  }

  private carregarFornecedoresPorEmpresa(empresaId: number): void {
    this.carregandoFornecedores = true;

    this.empresaService.fornecedoresPorEmpresa(empresaId).subscribe({
      next: (fornecedores) => {
        this.fornecedores = fornecedores;
        this.carregandoFornecedores = false;
      },
      error: () => {
        this.fornecedores = [];
        this.carregandoFornecedores = false;
      }
    });
  }

}
