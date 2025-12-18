import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-normal',
  imports: [CommonModule],
  templateUrl: './modal-normal.component.html'
})
export class ModalNormalComponent {

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  @Input() mensajeError = '';
  @Input() multiplesErrores:string[] = [];
  @Input() manejador: string = '';
  @Input() titulo: string = '';
  @Input() tipo: string = '';
  @Input() callback1!: () => void;
  @Input() nombreBtnAccion1: string = '';
  @Input() callback2!: (dato: number) => void;
  @Input() nombreBtnAccion2: string = '';

  //@Output() onClose = new EventEmitter<void>(); POR SI SE REQUIERE EMITIR ALGO AL PADRE

  abrir() {
    this.modal.nativeElement.showModal();
  }

  cerrar() {
    this.modal.nativeElement.close();
  }
}