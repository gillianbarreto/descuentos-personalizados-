import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { BenefitsService } from '../../services/benefits.service';
import { ErrorServiceMessage } from '../../shared.data';

declare var $: any;

@Component({
  selector: 'app-form-contact',
  templateUrl: './form-contact.component.html',
  styleUrls: ['./form-contact.component.scss'],
  providers: [BenefitsService]
})
export class FormContactComponent implements OnInit {

  public spinner = false;
  public typeSelected: string = "DNI";
  public documentPattern: string = "[0-9]{8}";
  public documentError: string = "Tu documento debe tener 8 dígitos";
  public documentPlaceHolder: string = "Tu número de DNI *";

  constructor(private benefitsService: BenefitsService) { }

  ngOnInit() { }

  /*************************************
  * Validar y Enviar Datos de Contacto
  *************************************/
  sendData(form) {
    if (!form.valid) return;
    // Toma primer nombre
    let name = form.value.name;
    if (!name) {
      $("#name").val('').focus();
      return;
    }
    let firstName = name;
    if (firstName.indexOf(' ') >= 0) {
      firstName = name.split(' ').slice(0, 1).join(' ');
    }
    // Muestra icon spinner en boton Guardar
    this.spinner = true;
    this.benefitsService.leadSave(form.value).subscribe(
      data => {
        this.spinner = false;
        if (data.error.code == 100) {
          this.showMessage("success", ' Hola ' + firstName + ',  ya tenemos tus datos. Pronto te avísaremos!', true, form);
        } else if (data.error.code == 101) {
          this.showMessage("warning", firstName + ',  el número de documento que has indicado no corresponde con el tipo seleccionado', false);
        } else {
          this.showMessage("success", '<strong> <i class="fa fa-trophy" aria-hidden="true"></i> Felicitaciones ' + firstName + '</strong> serás uno de los primeros que podrá descargar nuestra App!!', true, form);
        }
      },
      error => {
        this.spinner = false;
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage, false);
      }
    );
  }

  // Cambiar Pattern según el valor seleccionado
  changePattern(value) {
    if (value == 'DNI') {
      this.documentPattern = "[0-9]{8}";
      this.documentError = "Tu documento debe tener 8 dígitos";
      this.documentPlaceHolder = "Tu número de DNI *";
    } else {
      this.documentPattern = "[0-9]{9,12}";
      this.documentError = "Tu documento debe tener entre 9 y 12 dígitos";
      this.documentPlaceHolder = "Tu número de CE *";
    }
  }

  // Feedback formContact
  showMessage(c, t, reset, form?) {
    $('#feedback').html('<div class="alert alert-' + c + ' fade show">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> ' +
      ' <span class="pt-1 pr-1" aria-hidden="true">&times;</span></button>' + t +
      '</div>');
    setTimeout(() => {
      $('#feedback').html('');
      if (reset) {
        this.clearForm(form);
      }
    }, 5000);
  }

  // Limpia el form y esconde el modal
  clearForm(form) {
    form.reset();
    $('#formContactModal').modal('hide');
  }

}
