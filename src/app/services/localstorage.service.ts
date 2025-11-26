import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  getItem(nombre: string){
    
    let data = localStorage.getItem(nombre);

    if(data){
      return JSON.parse(data);
    }

    return null;
  }

  setItem<T>(data: T){
    localStorage.setItem('usuario-saving', JSON.stringify(data));
  }

  removerItem(){
    localStorage.removeItem('usuario-saving');
  }  
}
