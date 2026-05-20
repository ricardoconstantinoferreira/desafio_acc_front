import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'empresa/cadastro', pathMatch: 'full' },
	{
		path: 'empresa',
		loadChildren: () => import('./empresa/empresa.module').then((m) => m.EmpresaModule)
	}
];
