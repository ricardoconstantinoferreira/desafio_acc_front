import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FornecedorRoutingModule } from './fornecedor-routing.module';
import { ListagemComponent } from './listagem/listagem.component';
import { CadastroComponent } from './cadastro/cadastro.component';


@NgModule({
  declarations: [
    ListagemComponent,
    CadastroComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FornecedorRoutingModule
  ]
})
export class FornecedorModule { }
