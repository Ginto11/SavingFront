import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EventosSidebarService {
  private evento$ = new Subject<boolean>();

  emitir(valor: boolean) {
    this.evento$.next(valor);
  }

  escuchar(): Observable<boolean> {
    return this.evento$.asObservable();
  }
}
