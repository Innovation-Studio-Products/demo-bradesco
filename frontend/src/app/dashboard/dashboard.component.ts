import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="dashboard-container">
      <h2>Dashboard</h2>
      <p>Bem-vindo ao seu painel!</p>
      <nav>
        <a routerLink="/recorrencias">Ver Central de Recorrências</a>
      </nav>
    </div>
  `,
  styles: [`
    .dashboard-container { text-align: center; padding: 2rem; }
    nav { margin-top: 1rem; }
  `]
})
export class DashboardComponent {}
