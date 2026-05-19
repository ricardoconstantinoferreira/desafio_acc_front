import { Routes } from '@angular/router';
import { EmpresaComponent } from './empresa/empresa.component';

export const routes: Routes = [
	{ path: '', redirectTo: 'empresa/cadastro', pathMatch: 'full' },
	{ path: 'empresa/cadastro', component: EmpresaComponent, data: { view: 'cadastro' } },
	{ path: 'empresa/listagem', component: EmpresaComponent, data: { view: 'listagem' } }
];
