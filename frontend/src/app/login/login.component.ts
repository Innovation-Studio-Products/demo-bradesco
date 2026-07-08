import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <p>Página de login placeholder.</p>
      <button (click)="login()">Acessar Dashboard</button>
    </div>
  `,
  styles: [`
    .login-container { text-align: center; padding: 2rem; }
  `]
})
export class LoginComponent {
  constructor(private router: Router) {}

  login() {
    // Em um app real, haveria lógica de autenticação aqui
    this.router.navigate(['/dashboard']);
  }
}
