import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RecorrenciasService, Recorrencia } from '../services/recorrencias.service';
import { Observable, of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';

@Component({
  selector: 'app-recorrencias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recorrencias.component.html',
  styleUrls: ['./recorrencias.component.css']
})
export class RecorrenciasComponent implements OnInit {
  private recorrenciasService = inject(RecorrenciasService);
  private cdr = inject(ChangeDetectorRef);

  pendentes$!: Observable<Recorrencia[]>;
  outrasRecorrencias$!: Observable<Recorrencia[]>;
  
  loading = true;
  error: string | null = null;
  hasRecorrencias: boolean = false;

  ngOnInit(): void {
    const allRecorrencias$ = this.recorrenciasService.getRecorrencias().pipe(
      catchError(err => {
        this.error = 'Ocorreu um erro ao consultar suas autorizações. Por favor, tente novamente.';
        console.error(err);
        return of([]);
      }),
      shareReplay(1)
    );

    // Subscrição dedicada para controlar o estado de loading/hasRecorrencias
    allRecorrencias$.subscribe(recorrencias => {
      this.loading = false;
      this.hasRecorrencias = recorrencias.length > 0;
      this.cdr.markForCheck();
    });

    this.pendentes$ = allRecorrencias$.pipe(
      map(recs => recs.filter(r => r.status === 'pendente_aprovacao'))
    );

    this.outrasRecorrencias$ = allRecorrencias$.pipe(
      map(recs => recs.filter(r => r.status !== 'pendente_aprovacao'))
    );
  }


  onAprovar(id: number): void {
    console.log(`Ação: Aprovar/Retomar recorrência ${id}`);
    this.recorrenciasService.aprovarRecorrencia(id).subscribe({
      next: () => alert(`Recorrência ${id} aprovada/retomada com sucesso!`),
      error: () => alert(`Erro ao processar a recorrência ${id}.`)
    });
  }

  onPausar(id: number): void {
    console.log(`Ação: Pausar recorrência ${id}`);
    this.recorrenciasService.pausarRecorrencia(id).subscribe({
      next: () => alert(`Recorrência ${id} pausada com sucesso!`),
      error: () => alert(`Erro ao pausar a recorrência ${id}.`)
    });
  }

  onCancelar(id: number): void {
    console.log(`Ação: Cancelar/Recusar recorrência ${id}`);
    this.recorrenciasService.cancelarRecorrencia(id).subscribe({
      next: () => alert(`Recorrência ${id} cancelada/recusada com sucesso!`),
      error: () => alert(`Erro ao cancelar a recorrência ${id}.`)
    });
  }
}

