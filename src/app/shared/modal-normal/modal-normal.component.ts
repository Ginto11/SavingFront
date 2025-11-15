import { Component, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-modal-normal',
  templateUrl: './modal-normal.component.html'
})
export class ModalNormalComponent {

  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;

  @Input() titulo: string = '';
  @Input() tipo: string = '';
  //@Output() onClose = new EventEmitter<void>(); POR SI SE REQUIERE EMITIR ALGO AL PADRE

  abrir() {
    this.modal.nativeElement.showModal();
  }

  cerrar() {
    this.modal.nativeElement.close();
  }
}