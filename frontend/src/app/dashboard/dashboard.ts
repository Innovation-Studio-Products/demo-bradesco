import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
  protected readonly authService = inject(AuthService);
  
  // Acessa o sinal do usuário logado diretamente do AuthService
  protected readonly currentUser = this.authService.currentUser;
  
  /**
   * Realiza o logout do sistema
   */
  onLogout(): void {
    this.authService.logout();
  }
}
