import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Usuario {
  primerNombre: string;
  primerApellido: string;
  correo: string;
  cedula?: string;
  telefono?: string;
  fechaNacimiento?: string; 
  ciudad?: string;
}

@Component({
  selector: 'app-info-usuario',
  imports: [CommonModule, FormsModule],
  templateUrl: './info-usuario.component.html',
  styles: ``
})
export default class InfoUsuarioComponent {
  // Datos de ejemplo: reemplaza con lo que traigas del backend
  usuario: Usuario = {
    primerNombre: 'Nelson',
    primerApellido: 'Muñoz',
    correo: 'nelson@example.com',
    cedula: '1234567890',
    telefono: '+57 300 000 0000',
    fechaNacimiento: '2000-03-20',
    ciudad: 'Bogotá'
  };

  editMode = false;
  editingCopy: Usuario | null = null;

  iniciarEdicion() {
    this.editingCopy = { ...this.usuario };
    this.editMode = true;
  }

  cancelarEdicion() {
    this.editingCopy = null;
    this.editMode = false;
  }

  guardarCambios() {
    if (!this.editingCopy) return;
    // aquí debes llamar a tu servicio para guardar en backend
    // ejemplo: this.usuarioService.actualizar(this.editingCopy).subscribe(...)
    // por ahora solo aplicamos la copia localmente:
    this.usuario = { ...this.editingCopy };
    this.editingCopy = null;
    this.editMode = false;
    // opcional: mostrar toast o notificación
  }

  // helper para mostrar nombre completo
  get nombreCompleto() {
    return `${this.usuario.primerNombre} ${this.usuario.primerApellido}`;
  }
}
