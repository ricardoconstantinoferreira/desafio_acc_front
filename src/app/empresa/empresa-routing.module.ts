import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroComponent } from './cadastro/cadastro.component';
import { ListagemComponent } from './listagem/listagem.component';
import { AdicionarFornecedoresComponent } from './adicionar-fornecedores/adicionar-fornecedores.component';
import { FornecedoresPorEmpresasComponent } from './fornecedores-por-empresas/fornecedores-por-empresas.component';

const routes: Routes = [
  { path: '', redirectTo: 'cadastro', pathMatch: 'full' },
  { path: 'cadastro', component: CadastroComponent, data: { view: 'cadastro' } },
  { path: 'listagem', component: ListagemComponent, data: { view: 'listagem' } },
  { path: 'adicionar-fornecedores', component: AdicionarFornecedoresComponent, data: {view: 'adicionar-fornecedores'}},
  { path: 'fornecedores-por-empresa', component: FornecedoresPorEmpresasComponent, data: { view: 'fornecedores-por-empresa' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmpresaRoutingModule { }
