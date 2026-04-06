import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  private themeDark = new BehaviorSubject<boolean>(false);
  themeDarkObservable = this.themeDark.asObservable(); 

  emitir(valor: boolean){
    this.themeDark.next(valor);
  }
}
