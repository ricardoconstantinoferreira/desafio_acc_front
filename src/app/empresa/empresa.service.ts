import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { Empresa } from './empresa';
import { Fornecedor } from '../fornecedor/fornecedor';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  private readonly uri = `${environment.api.baseUrl}${environment.api.empresasPath}`;
  private readonly options = {
    headers: {
      'Content-Type': 'application/json',
      'Accept-Language': 'pt-BR'
    }
  };

  constructor(private http: HttpClient) { }

  criar(empresa: Pick<Empresa, 'documento' | 'fantasia' | 'cep'>): Observable<Empresa> {
    return this.http.post<Empresa>(this.uri, empresa, this.options);
  }

  atualizar(id: number, empresa: Pick<Empresa, 'documento' | 'fantasia' | 'cep'>): Observable<Empresa> {
    return this.http.put<Empresa>(`${this.uri}/${id}`, empresa, this.options);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${id}`, this.options);
  }

  listagem(): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.uri).pipe(catchError(() => of([])));
  } 

  getById(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.uri}/${id}`);
  }

  vincularFornecedores(id: number, fornecedorIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.uri}/${id}/fornecedores`, fornecedorIds, this.options);
  }

  fornecedoresPorEmpresa(id: number): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(`${this.uri}/${id}/fornecedores`).pipe(catchError(() => of([])));
  }
}
