import { Component, OnInit, HostListener } from '@angular/core';
import { ErrorServiceMessage } from '../shared/shared.data';

import { AuthenticationService } from '../shared/services/authentication.service';
import { BenefitsService } from '../shared/services/benefits.service';
import { sources } from '../shared/models/setting-benefits';

// Para Login automatico
import { StorageService } from '../shared/services/storage.service';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';

// Facebook 
import { AuthService, SocialUser } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    AuthenticationService,
    BenefitsService,
    StorageService,
    AuthService
  ]
})
export class SignupComponent implements OnInit {

  @HostListener('window:beforeunload', ['$event'])
  beforeClose($event) {
    // Actualiza Tracking
    if (this.pActual) {
      // Actualizar tracking
      this.saveTrackingRegister(this.pActual);
    }
    $event.returnValue = '¿Seguro quieres irte?';
  }

  public fecha: Date = new Date();
  public showStep1: boolean;
  public showStep2: boolean;
  public showStep3: boolean;
  public showStep4: boolean;
  public showStep5: boolean;
  public spinner = false;
  public spinnerFb = false;
  public data;
  public isLogged;
  public availableSources: sources[];
  public selectedSources = [];
  public feedback;
  public userFacebook: SocialUser;
  public messageTotalSources;
  public initial = true;
  public messageAlert: string;
  public classAlert: string;
  public disconnect = false;
  public codigoPromocion = "";
  public aceptaTerminos = false;

  public documentPattern: string = "[0-9]{8}";
  public documentError: string = "Tu documento debe tener 8 dígitos";
  public documentPlaceHolder: string = "Tu número de DNI *";

  // Datos para Tracking
  public np1 = "next correo";     // Al hacer click en boton Siguiente
  public np2 = "next dni";
  public np3 = "next terminos";
  /*public pp1 = "previo correo";   // Al hacer click en boton Anterior
    public pp2 = "previo dni";
    public pp3 = "previo terminos";*/
  public pwp1 = "preview correo"; // Al visualizar la pantalla
  public pwp2 = "preview dni";
  public pwp3 = "preview terminos";
  public p1: boolean;             // Para saber si el usuario visualizo la pantalla
  public p2: boolean;
  public p3: boolean;
  public xp1 = "destroy correo";  // Al cerrar la ventana o el navegador
  public xp2 = "destroy dni";
  public xp3 = "destroy terminos";
  public pActual;                 // Pantalla donde se encuentra al cerrar
  public facebookId;              // Datos de facebook, aunque haya ingreso fallido
  public facebookToken;
  public deviceToken;             // ID de usuario 

  constructor(private loginService: AuthenticationService,
    private benefitsService: BenefitsService,
    private storageService: StorageService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.isLogged = this.storageService.isAuthenticated();
    if (this.isLogged) {
      this.showMessage("warning", "Cierre su sesión");
    } else {
      // Inicializar Vista
      this.spinner = false;
      this.spinnerFb = false;
      this.initial = true;
      this.viewStep(true);
      this.disconnect = false;
      this.userFacebook = null;
      this.deviceToken = Math.random().toString(36).substr(2, 9) + '-' + this.fecha.getTime().toString();
      this.initDataAll();
      this.searchSources();
    }
  }

  /*************************
   *  Login con facebook 
   *************************/
  signInWithFB(): void {
    if (!this.userFacebook) {
      this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
      this.getDataUserFB();
      this.disconnect = false;
    } else {
      this.showMessage("warning", this.userFacebook.firstName + ", ya estás logeado con Facebook!");
      this.disconnect = true;
    }
  }
  // Logout 
  signOutFB(): void {
    this.userFacebook = null;
    this.authService.signOut();
    this.disconnect = false;
  }
  // Obtener Usuario de Facebook
  getDataUserFB() {
    this.spinnerFb = true;
    this.authService.authState.subscribe((user) => {
      if (user) {
        // Datos del usuario
        this.userFacebook = user;
        this.facebookId = this.userFacebook.id;
        this.facebookToken = this.userFacebook.authToken;
        this.validateDataFB(user);
      } else {
        this.spinnerFb = false;
        this.showMessage("danger", "No ha sido posible la conexión con Facebook!");
      }
    });
  }

  validateDataFB(user) {
    // Verifica que el correo NO exista
    let param = { "type": 0, "id": user.email, "firebaseToken": "web", "deviceToken": "web", "device": "web" };
    this.loginService.login(param).subscribe(
      data => {
        this.spinnerFb = false;
        if (data.data.correo) {
          this.userFacebook = null;
          this.disconnect = false;
          this.showMessage("danger", " El correo " + data.data.correo + " ya está registrado!! ");
        } else {
          // Actualiza form con datos de facebook
          this.data.nombres = user.firstName;
          this.data.apellidos = user.lastName;
          this.data.correo = user.email;
          this.data.alias = user.firstName;
          this.data.tokenRedSocial = user.authToken;
          this.data.idRedSocial = user.id;
          this.data.rutaFotoLarge = user.photoUrl;
          // Registra Log
          let param = {
            "estadoUsuario": 1,
            "tokenRedSocial": user.authToken
          }
          this.spinnerFb = true;
          this.loginService.retrieveUser(param).subscribe(
            data => {
              this.spinnerFb = false;
              if (data.error.code > 0) {
                console.log(data.error);
              }
              this.data.fechaNacimiento = data.data.fechaNacimiento;
            },
            error => {
              this.spinnerFb = false;
              console.log(error);
              this.showMessage("danger", ErrorServiceMessage);
            }
          );
          // Muestra pantalla siguiente
          this.initial = false;
          // Actualiza Tracking
          if (!this.p1) {
            this.p1 = true;
            this.saveTrackingRegister(this.pwp1);
          }
        }
      },
      error => {
        this.spinnerFb = false;
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage);
      }
    );
  }

  /*************************
   *  Login con correo
   *************************/
  signInEmail() {
    this.initial = false;
    // Actualiza Tracking
    if (!this.p1) {
      this.p1 = true;
      this.saveTrackingRegister(this.pwp1);
    }
  }

  /*************************
  *  Pantallas de Datos
  *************************/
  /*** Step 1: Datos Básicos ***/
  btnNextBasicData(value) {
    this.data.nombres = value.nombres;
    this.data.apellidos = value.apellidos;
    this.data.correo = value.correo;
    this.data.alias = value.alias;

    // Verifica que el correo No exista
    this.spinner = true;
    let param = { "type": 0, "id": value.correo, "firebaseToken": "web", "deviceToken": "web", "device": "web" }
    this.loginService.login(param).subscribe(
      data => {
        this.spinner = false;
        if (data.data.estadoUsuario == "1") {
          this.viewStep(false, true);
        } else {
          this.showMessage("danger", " El correo " + value.correo + " ya está registrado!! ");
        }
      },
      error => {
        this.spinner = false;
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage);
      }
    );

    // Actualiza Tracking
    this.saveTrackingRegister(this.np1);
    if (!this.p2) {
      this.p2 = true;
      this.saveTrackingRegister(this.pwp2);
    }

  }
  // Boton Anterior Datos Basicos - va a primera pantalla
  btnPrevBasicData() {
    this.initial = true;
    this.userFacebook = null;
    this.disconnect = false;
  }

  /*** Step 2: Datos Personales ***/
  btnNextPersonalData(value) {
    this.assignPersonalData(value);
    this.viewStep(false, false, true);
    // Actualiza Tracking
    this.saveTrackingRegister(this.np2);
    if (!this.p3) {
      this.p3 = true;
      this.saveTrackingRegister(this.pwp3);
    }
  }
  // Botón anterior
  btnPrevPersonalData(value) {
    this.assignPersonalData(value);
    this.viewStep(true);
  }
  // Tomar valores de Personal Data
  assignPersonalData(value) {
    this.data.tipoDocumento = value.tipoDocumento;
    this.data.numeroDocumento = value.numeroDocumento;
    this.data.telefono = value.telefono;
    this.data.sexo = value.sexo;
  }

  /*** Step 3: Datos Personales ***/
  // Guardar Usuario
  btnRegistrame(value) {
    this.data.codigoReferido = value.codigoReferido;
    this.data.aceptaTerminos = value.aceptaTerminos;
    if (this.availableSources.length > 0) {
      this.checkedSources();
    }
    // Verifica si ya está registrado
    if (this.data.idUser) {

    } else {
      let param;
      this.data.firebaseToken = "web";
      this.data.deviceToken = "web";
      this.data.device = "web";
      this.spinner = true;
      // Limpia el tipo de documento para evitar error
      if (!this.data.numeroDocumento) {
        this.data.tipoDocumento = "";
      }
      this.loginService.signUp(this.data).subscribe(
        data => {
          if (!data.data && !data.listData) {
            this.showMessage("danger", data.error.message);
            this.spinner = false;
          } else {
            this.codigoPromocion = data.data.codigoPromocion;
            // Login automático
            if (this.userFacebook) {
              param = {
                "type": 1, "id": this.userFacebook.id, "token": this.userFacebook.authToken,
                "firebaseToken": "web", "deviceToken": "web", "device": "web"
              };
            } else {
              param = { "type": 0, "id": this.data.correo, "firebaseToken": "web", "deviceToken": "web", "device": "web" };
            }
            this.loginService.login(param).subscribe(
              data => {
                this.data = data.data;
                this.spinner = false;
                if (!data.data && !data.listData) {
                  this.showMessage("danger", data.error.message);
                } else {
                  // Actualiza la session y la vista
                  this.storageService.setCurrentSession(data.data);
                  NavbarComponent.updateView.next(true);
                }
              },
              error => {
                this.spinner = false;
                console.log(error);
                this.showMessage("danger", ErrorServiceMessage);
              }
            );
            this.viewStep(false, false, false, true);
          }
        },
        error => {
          this.spinner = false;
          console.log(error);
          this.showMessage("danger", ErrorServiceMessage);
        }
      );
      // Actualiza Tracking
      this.saveTrackingRegister(this.np3);
    }
  }
  // Botón anterior
  btnPrevConfirm(value) {
    this.data.codigoReferido = value.codigoReferido;
    this.data.aceptaTerminos = value.aceptaTerminos;
    this.viewStep(false, true);
  }

  /*** Step 4: Suscripciones ***/
  btnPrevSuscriptions(value) {
    this.data.suscripcionesCodigo = this.selectedSources;
    this.viewStep(false, false, true);
  }

  /*** Step 5: Guardar usuario ***/
  sendData(value) {
    this.data.suscripcionesCodigo = this.selectedSources;
    this.spinner = true;
    let param = {
      idUser: this.data.idUser,
      suscripcionesCodigo: this.data.suscripcionesCodigo
    };
    // Guarda fuentes de suscripcion
    this.loginService.saveSubscriptions(param).subscribe(
      data => {
        this.spinner = false;
        // Actualiza la session y la vista
        this.storageService.setCurrentSession(this.data);
        this.initDataAll();
      },
      error => {
        this.spinner = false;
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage);
        this.initDataAll();
      }
    );
    this.viewStep(false, false, false, false, true);
  }

  /*** Guardar Tracking de Registro de Usuarios ***/
  saveTrackingRegister(screen) {
    let param = {
      "screenRegister": screen,
      "device": "web",
      "deviceToken": this.deviceToken,
      "loginType": (this.userFacebook !== null ? "Facebook" : "Correo"),
      "name": this.data.nombres,
      "lastName": this.data.apellidos,
      "alias": this.data.alias,
      "correo": this.data.correo,
      "phoneNumber": this.data.telefono,
      "numberVerified": false,
      "documentType": this.data.tipoDocumento,
      "numeroDocumento": this.data.numeroDocumento,
      "gender": this.data.sexo,
      "otpCode": this.data.codigoOtp,
      "promotionalCode": this.data.codigoReferido,
      "checkTerms": this.data.aceptaTerminos,
      "idRedSocial": this.facebookId,
      "tokenFacebook": this.facebookToken
    };

    // Guarda Pista de acciones de usuario en Registro
    this.benefitsService.saveTrackingRegister(param).subscribe(
      data => { },
      error => { console.log(error); }
    );
  }

  /***************
   *  Generales 
   ***************/
  // Init data
  initData() {
    return {
      nombres: "",
      apellidos: "",
      correo: "",
      codigoOtp: "",
      fechaNacimiento: "",
      alias: "",
      tipoDocumento: "DNI",
      numeroDocumento: "",
      telefono: "",
      sexo: "",
      codigoReferido: "",
      suscripcionesCodigo: [],
      codigoPromocion: "",
      tokenRedSocial: "",
      rutaFotoLarge: "../../assets/img/placeholder-photo.png",
      idRedSocial: "",
      aceptaTerminos: false
    };
  }

  // Limpia todo 
  initDataAll() {
    this.data = this.initData();
    this.facebookId = null;
    this.facebookToken = null;
    this.p1 = false;
    this.p2 = false;
    this.p3 = false;
  }

  // Ver step
  viewStep(s1, s2 = false, s3 = false, s4 = false, s5 = false) {
    // Para mostrar/ocultar pantallas
    this.showStep1 = s1;
    this.showStep2 = s2;
    this.showStep3 = s3;
    this.showStep4 = s4;
    this.showStep5 = s5;
    // Para identificar pantalla donde se encuentra el usuario
    if (s1) {
      this.pActual = this.xp1;
    } else if (s2) {
      this.pActual = this.xp2;
    } else if (s3) {
      this.pActual = this.xp3;
    } else {
      this.pActual = null;
    }
  }

  // Cambiar Pattern según el valor seleccionado en Tipo de Documento
  changePattern(value) {
    if (value == 'DNI') {
      this.documentPattern = "[0-9]{8}";
      this.documentError = "Tu documento debe tener 8 dígitos";
      this.documentPlaceHolder = "Tu número de DNI";
    } else {
      this.documentPattern = "[0-9]{9,12}";
      this.documentError = "Tu documento debe tener entre 9 y 12 dígitos";
      this.documentPlaceHolder = "Tu número de CE";
    }
  }

  // Feedback formContact
  showMessage(c, t) {
    this.messageAlert = t;
    this.classAlert = "alert-" + c;
    setTimeout(() => { this.messageAlert = ""; }, 5000);
  }

  /***************
   *  Fuentes 
   ***************/
  // Contar y almacenar suscripciones
  totalSources() {
    let total = 0;
    let ids;
    let nodo;
    let c = this.availableSources.length;
    this.selectedSources = [];
    for (let i = 0; i < c; i++) {
      ids = "fuente-" + this.availableSources[i].id;
      nodo = document.getElementById(ids);
      if (nodo) {
        // Si esta chequeado
        if (nodo.checked) {
          this.selectedSources.push(nodo.value);
          this.availableSources[i].checked = true;
          total++;
          // Si no está chequeado
        } else {
          this.availableSources[i].checked = false;
        }
      }
    }
    this.messageTotal(total);
  }

  // Contar y almacenar suscripciones
  checkedSources() {
    let sources = this.data.suscripcionesCodigo;
    let nodo;
    let c = sources.length;
    for (let i = 0; i < c; i++) {
      nodo = this.availableSources.findIndex(({ id }) => id === sources[i]);
      if (nodo > -1) {
        this.availableSources[nodo].checked = true;
      }
    }
    this.selectedSources = this.data.suscripcionesCodigo;
    this.messageTotal(c);
  }

  // Cuantos programas de suscripción 
  messageTotal(c) {
    if (c > 0) {
      this.messageTotalSources = 'Tienes ' + c + (c > 1 ? ' suscripciones' : 'suscripción');
    }
  }

  // Buscar fuentes de suscripción 
  searchSources() {
    this.benefitsService.getSourcesList({}).subscribe(
      data => {
        if (data.listData) {
          this.availableSources = data.listData;
          this.availableSources = this.availableSources.filter(({ tipoSuscripcion }) => tipoSuscripcion === "1");
          let c = this.availableSources.length;
          for (let i = 0; i < c; i++) {
            this.availableSources[i].checked = false;
          }
        }
      },
      error => {
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage);
      }
    );
  }

}