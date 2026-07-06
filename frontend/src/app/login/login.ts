import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  
  // Sinais de estado
  protected readonly isLoginMode = signal<boolean>(true);
  protected readonly isLoading = signal<boolean>(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  
  // Formulário de Login
  protected readonly loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  
  // Formulário de Registro
  protected readonly registerForm: FormGroup = this.fb.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });
  
  /**
   * Alterna entre modo Login e Registro
   */
  toggleMode(): void {
    this.isLoginMode.update(mode => !mode);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }
  
  /**
   * Envia o formulário de Login
   */
  onSubmitLogin(): void {
    if (this.loginForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const { username, password } = this.loginForm.value;
    
    this.authService.login(username, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const detail = err.error?.detail || 'Erro ao realizar login. Tente novamente.';
        this.errorMessage.set(detail);
      }
    });
  }
  
  /**
   * Envia o formulário de Registro
   */
  onSubmitRegister(): void {
    if (this.registerForm.invalid) {
      this.errorMessage.set('Por favor, preencha todos os campos corretamente.');
      return;
    }
    
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    
    const { username, fullName, password } = this.registerForm.value;
    
    this.authService.register(username, password, fullName).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.successMessage.set('Conta criada com sucesso! Faça login abaixo.');
        this.isLoginMode.set(true);
        this.registerForm.reset();
      },
      error: (err) => {
        this.isLoading.set(false);
        const detail = err.error?.detail || 'Erro ao criar conta. Tente novamente.';
        this.errorMessage.set(detail);
      }
    });
  }
}
