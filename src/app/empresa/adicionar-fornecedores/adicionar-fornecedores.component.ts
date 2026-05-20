import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Empresa } from '../empresa';
import { EmpresaService } from '../empresa.service';
import { Fornecedor } from '../../fornecedor/fornecedor';
import { FornecedorService } from '../../fornecedor/fornecedor.service';

@Component({
  selector: 'app-adicionar-fornecedores',
  standalone: false,
  templateUrl: './adicionar-fornecedores.component.html',
  styleUrl: './adicionar-fornecedores.component.scss'
})
export class AdicionarFornecedoresComponent implements OnInit {
  constructor(
    private readonly empresaService: EmpresaService,
    private readonly fornecedorService: FornecedorService
  ) {}

  empresas: Empresa[] = [];
  fornecedores: Fornecedor[] = [];
  carregando = false;
  vinculando = false;
  showModal = false;
  modalType: 'success' | 'error' = 'success';
  modalTitle = '';
  modalMessage = '';

  selecao = {
    empresaId: '',
    fornecedorIds: [] as number[]
  };

  ngOnInit(): void {
    this.carregando = true;

    forkJoin({
      empresas: this.empresaService.listagem(),
      fornecedores: this.fornecedorService.listagem()
    }).subscribe({
      next: ({ empresas, fornecedores }) => {
        this.empresas = empresas;
        this.fornecedores = fornecedores;
        this.carregando = false;
      },
      error: () => {
        this.empresas = [];
        this.fornecedores = [];
        this.carregando = false;
      }
    });
  }

  get empresaSelecionada(): Empresa | undefined {
    return this.empresas.find((empresa) => String(empresa.id) === this.selecao.empresaId);
  }

  get fornecedoresSelecionados(): Fornecedor[] {
    return this.fornecedores.filter((fornecedor) => this.selecao.fornecedorIds.includes(fornecedor.id));
  }

  get empresaDescricao(): string {
    if (!this.empresaSelecionada) {
      return 'Nenhuma empresa selecionada';
    }

    return `${this.empresaSelecionada.fantasia} - ${this.empresaSelecionada.documento}`;
  }

  fornecedorDescricao(fornecedor: Fornecedor): string {
    return `${fornecedor.nome} - ${fornecedor.documento}`;
  }

  vincular(): void {
    const empresaId = Number(this.selecao.empresaId);
    const fornecedorIds = this.selecao.fornecedorIds;

    if (!empresaId || fornecedorIds.length === 0) {
      this.openModal('Falha na validacao', 'Selecione uma empresa e ao menos um fornecedor.', 'error');
      return;
    }

    this.vinculando = true;

    this.empresaService.vincularFornecedores(empresaId, fornecedorIds).subscribe({
      next: () => {
        this.vinculando = false;
        this.limparFormulario();
        this.openModal('Vinculacao realizada', 'Fornecedores vinculados com sucesso.', 'success');
      },
      error: () => {
        this.vinculando = false;
        this.openModal('Falha na vinculacao', 'Nao foi possivel vincular os fornecedores.', 'error');
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

  private limparFormulario(): void {
    this.selecao = {
      empresaId: '',
      fornecedorIds: []
    };
  }

}
