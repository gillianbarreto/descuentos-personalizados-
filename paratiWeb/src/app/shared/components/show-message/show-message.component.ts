import { Component, OnInit, Input } from '@angular/core';
import { ShowImagesComponent } from '../show-images/show-images.component';

@Component({
  selector: 'app-show-message',
  templateUrl: './show-message.component.html',
  styleUrls: ['./show-message.component.scss']
})
export class ShowMessageComponent implements OnInit {

  @Input() info: any;
  public message: string = '';

  constructor() { }

  ngOnInit() {
    if (this.info) {
      switch (this.info.code) {
        case 100:
          this.message = 'El descuento que buscas no fue encontrado!';
          break;
        case 101:
          this.message = 'No se encontró descuentos según tu condición de búsqueda. ¡Intenta otra vez!';
          break;
        case 404:
          this.message = '404 - Página no encontrada';
          break;
        case 500:
          this.message = 'El servicio de búsqueda NO está disponible ahora. Intenta más tarde';
          break;
        default:
          this.message = 'Un error ha ocurrido';
      }
    }
  }

}
