import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RecorrenciasComponent } from './recorrencias/recorrencias.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'recorrencias', 
    component: RecorrenciasComponent,
    canActivate: [AuthGuard]
  },
  // Redireciona para o dashboard caso a rota não seja encontrada e o usuário esteja "logado"
  { path: '**', redirectTo: 'dashboard' }
];

