import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

// Simulação de um serviço de autenticação
// Em um app real, isso verificaria um token ou estado de sessão
const FAKE_AUTH_SERVICE = {
  isLoggedIn: () => true // MOCK: Sempre retorna true para desenvolvimento
};

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  if (FAKE_AUTH_SERVICE.isLoggedIn()) {
    return true;
  } else {
    // Redireciona para a página de login se não estiver autenticado
    return router.parseUrl('/login');
  }
};
