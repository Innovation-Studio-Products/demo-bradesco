import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Recorrencia {
  id: number;
  beneficiario: string;
  valor: number;
  status: 'ativa' | 'pausada' | 'pendente_aprovacao';
  proximaCobranca?: string;
  periodicidade?: string;
  dataPausa?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RecorrenciasService {

  private apiUrl = 'http://127.0.0.1:9000/api/recorrencias'; // Usando a porta do backend definida em run.py

  constructor(private http: HttpClient) { }

  getRecorrencias(): Observable<Recorrencia[]> {
    return this.http.get<Recorrencia[]>(this.apiUrl);
  }

  aprovarRecorrencia(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/approve`, {});
  }

  pausarRecorrencia(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/pause`, {});
  }

  cancelarRecorrencia(id: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/cancel`, {});
  }
}

