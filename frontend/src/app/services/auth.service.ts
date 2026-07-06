import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
  id: number;
  username: string;
  full_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  user: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  
  private readonly apiUrl = 'http://localhost:8000/api';
  
  // Signals para gerenciar o estado da autenticação
  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);
  
  // Computed/Selectores baseados nos signals
  public readonly currentUser = computed(() => this._currentUser());
  public readonly isAuthenticated = computed(() => !!this._token());
  
  constructor() {
    this.loadSession();
  }
  
  /**
   * Tenta fazer o login com o backend Python SQLite
   */
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { username, password }).pipe(
      tap(response => {
        this.saveSession(response.access_token, response.user);
      })
    );
  }
  
  /**
   * Tenta registrar um novo usuário
   */
  register(username: string, password: string, fullName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, { 
      username, 
      password, 
      full_name: fullName 
    });
  }
  
  /**
   * Finaliza a sessão do usuário
   */
  logout(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }
  
  /**
   * Salva a sessão no LocalStorage e nos Signals
   */
  private saveSession(token: string, user: User): void {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    
    this._token.set(token);
    this._currentUser.set(user);
  }
  
  /**
   * Carrega a sessão do LocalStorage para os Signals
   */
  private loadSession(): void {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');
    
    if (token && userJson) {
      try {
        const user = JSON.parse(userJson) as User;
        this._token.set(token);
        this._currentUser.set(user);
      } catch (e) {
        this.clearSession();
      }
    }
  }
  
  /**
   * Limpa os dados de sessão
   */
  private clearSession(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    
    this._token.set(null);
    this._currentUser.set(null);
  }
}
