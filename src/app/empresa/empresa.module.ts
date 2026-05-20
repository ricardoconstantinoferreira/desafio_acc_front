import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { EmpresaRoutingModule } from './empresa-routing.module';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ListagemComponent } from './listagem/listagem.component';
import { AdicionarFornecedoresComponent } from './adicionar-fornecedores/adicionar-fornecedores.component';
import { FornecedoresPorEmpresasComponent } from './fornecedores-por-empresas/fornecedores-por-empresas.component';


@NgModule({
  declarations: [
    CadastroComponent,
    ListagemComponent,
    AdicionarFornecedoresComponent,
    FornecedoresPorEmpresasComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    EmpresaRoutingModule
  ]
})
export class EmpresaModule { }
