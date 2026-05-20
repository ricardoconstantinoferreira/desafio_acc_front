import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Fornecedor } from './fornecedor';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FornecedorService {

  private readonly uri = `${environment.api.baseUrl}${environment.api.fornecedoresPath}`;
    private readonly options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'pt-BR'
      }
    };

  constructor(private http: HttpClient) { }

  criar(fornecedor: Pick<Fornecedor, 'documento' | 'nome' | 'cep' | 'email' | 'nascimento' | 'rg'>): Observable<Fornecedor> {
    return this.http.post<Fornecedor>(this.uri, fornecedor, this.options);
  }

  atualizar(id: number, fornecedor: Pick<Fornecedor, 'documento' | 'nome' | 'cep' | 'email' | 'nascimento' | 'rg'>): Observable<Fornecedor> {
    return this.http.put<Fornecedor>(`${this.uri}/${id}`, fornecedor, this.options);
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.uri}/${id}`, this.options);
  }

  listagem(): Observable<Fornecedor[]> {
    return this.http.get<Fornecedor[]>(this.uri).pipe(catchError(() => of([])));
  } 

  getById(id: number): Observable<Fornecedor> {
    return this.http.get<Fornecedor>(`${this.uri}/${id}`);
  }

  buscarCep(cep: string): Observable<{ uf?: string; erro?: boolean } | null> {
    return this.http
      .get<{ uf?: string; erro?: boolean }>(`https://viacep.com.br/ws/${cep}/json/`)
      .pipe(catchError(() => of(null)));
  }
}
