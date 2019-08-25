import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ErrorServiceMessage } from '../../shared.data';

// Vistas a actualizar
import { NavbarComponent } from '../navbar/navbar.component';
import { RubrosComponent } from '../rubros/rubros.component';
import { BenefitDetailComponent } from '../../../benefits/benefit-detail/benefit-detail.component';
import { BenefitListComponent } from '../../../benefits/benefit-list/benefit-list.component';
import { BenefitThumbComponent } from '../../../shared/components/benefit-thumb/benefit-thumb.component';
import { Router } from '@angular/router';

// Session de Usuario
import { Session, User } from '../../models/setting-session';
import { StorageService } from '../../services/storage.service';
import { AuthenticationService } from '../../services/authentication.service';

// Facebook 
import { AuthService, SocialUser } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login"; 

declare var $ :any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [  
    AuthenticationService, 
    StorageService,
    AuthService
  ]
})
export class LoginComponent implements OnInit {

  public spinner = false;
  public spinnerFb = false;
  public userFacebook: SocialUser;

  constructor( private loginService: AuthenticationService,
               private storageService: StorageService,
               private navbar: NavbarComponent,
               public  router: Router,
               public location: Location,
               private authService: AuthService ) {
  }

  ngOnInit() {
    this.userFacebook = null;
   }

  /*********************
   * Ir a registrarse 
   ********************/
  signUp() {
    this.clearForm();
    this.router.navigate(['/signup']);
  }

  /*************************************
  * Validar y Enviar Datos de Login
  *************************************/
  // Si entra con correo
  loginData(form) {
    if (!form.valid) return;
    if (!form.value.emailLogin) return;
    this.spinner = true;
    this.userFacebook = null;
    this.validaEmail(form, form.value.emailLogin);
  }

  // Actualiza vistas
  updateView(alias) {
    // Actualiza Barra de Navegación
    this.navbar.logged(true, alias);
    // Actualiza Vistas dependiendo donde se encuentra
    var route = this.location.prepareExternalUrl(this.location.path());
    if (route === '#/home') {
      RubrosComponent.updateView.next(true);
    } else if (route.startsWith('#/descuentos')) {
      BenefitListComponent.updateView.next(true);
    } else if (route.startsWith('#/descuento')) {
      BenefitDetailComponent.updateView.next(true);
      BenefitThumbComponent.updateView.next(true);
    } else {
      this.router.navigate(['/home']);
    }
  } 

   /***************
    *  Facebook
    ***************/
  signInWithFB(form) {
    if (!this.storageService.isAuthenticated()) {
      this.userFacebook = null;
    }
    if (!this.userFacebook ) {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
      this.getDataUserFB(form);
    }
  }
  signOut(): void {
      this.authService.signOut();
  }
  getDataUserFB(form) {
    this.spinnerFb = true; 
    this.authService.authState.subscribe((user) => {
      if (user) {
        this.userFacebook = user;
        this.validaEmail(form, user.email);
      } else {
        this.spinnerFb = false;
        this.showMessage("danger", "No ha sido posible la conexión con Facebook!", false);
      }
    });
  }

  /********************************
  * Verifica que el correo exista
  *********************************/ 
  validaEmail(form, email) {
    let param;
    if (this.userFacebook) {
      param = { "type":1, "id":  this.userFacebook.id, "token": this.userFacebook.authToken,
                "firebaseToken":"web", "deviceToken":"web", "device":"web" };
    } else {
      param = {  "type":0, "id": email, "firebaseToken":"web", "deviceToken":"web", "device":"web" };
    } 
    this.loginService.login(param).subscribe(
      data => {
          this.spinnerFb = false;
          this.spinner = false;
          if (!data.data && !data.listData) {
            this.showMessage("danger", data.error.message, false);
            form.reset();
          } if (!data.data.idUser) { 
            this.showMessage("danger", "Disculpe, sus credenciales de facebook no fueron encontradas. Si se registró antes con su e-mail, ingrese a la aplicación y en su perfil, haga click en el botón Conectar con Facebook", false);
            form.reset();
          } else {
            this.clearForm(form);
            let dataUsr: User = data.data;
            // Actualiza el usuario si se logeo con Facebook
            if (this.userFacebook) {
              dataUsr.idRedSocial = this.userFacebook.id;
              dataUsr.rutaFotoLarge = this.userFacebook.photoUrl;
              dataUsr.tokenRedSocial = this.userFacebook.authToken;
              this.updateUser(dataUsr, form);
            }
            // Actualiza la session y la vista
            this.storageService.setCurrentSession(dataUsr);
            this.updateView(dataUsr.alias);
            document.getElementById('closeModal').click();  
          }
        },
      error => {
          this.spinner = false;
          this.spinnerFb = false;
          console.log(error);
          this.showMessage("danger", ErrorServiceMessage, false);
        }
    );
  }

  /************************
  * Actualiza Usuario FB
  ************************/ 
  updateUser(data, form) {
    this.spinnerFb = true;
    let param = {
      "numeroDocumento": data.numeroDocumento,
      "idRedSocial": this.userFacebook.id,
      "rutaFotoLarge": this.userFacebook.photoUrl,
      "tokenRedSocial": this.userFacebook.authToken,
      "correo": this.userFacebook.email
    }
    this.loginService.updateUser(param).subscribe(
      data => {
          this.spinnerFb = false;
          if (!data.data && !data.listData) {
            this.showMessage("danger", data.error.message, false);
            form.reset();
          }
        },
      error => {
          this.spinnerFb = false;
          console.log(error);
          this.showMessage("danger", ErrorServiceMessage, false);
        }
    );
  }

  // Feedback formContact
  showMessage(c, t, reset, form?) {
    $('#success').html('<div class="alert alert-' + c + ' fade show">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"> ' +
      ' <span class="pt-1 pr-1" aria-hidden="true">&times;</span></button>' + t +
      '</div>');
    setTimeout(() => {
      $('#success').html('');
      if (reset) {
        this.clearForm(form);
      }
    }, 7000);
  }

  // Limpia el form y esconde el modal
  clearForm(form?) {
    if (form) form.reset();
    $('#formLoginModal').modal('hide');
    $('#success').html('');
  }

}
