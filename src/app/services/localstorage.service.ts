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

  setItem<T>(nombre: string, data: T){
    localStorage.setItem(nombre, JSON.stringify(data));
  }

  removerItem(nombre: string){
    localStorage.removeItem(nombre);
  }  
}
