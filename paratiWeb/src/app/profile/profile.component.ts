import { Component, OnInit } from '@angular/core';
import { ErrorServiceMessage } from '../shared/shared.data';
import { sources } from '../shared/models/setting-benefits';

import { AuthenticationService } from '../shared/services/authentication.service';
import { BenefitsService } from '../shared/services/benefits.service';
import { StorageService } from '../shared/services/storage.service';

// Facebook 
import { AuthService, SocialUser } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['../signup/signup.component.scss'],
    providers: [ 
        AuthenticationService, 
        BenefitsService,
        StorageService,
        AuthService
    ]
})

export class ProfileComponent implements OnInit {

    public showDatosBasicos: boolean = true;
    public spinner = false;
    public spinnerFb = false;
    public data;
    public messageTotalSources: string;
    public availableSources: sources[];
    public selectedSources = [];
    public feedback;
    public isLogged;
    public userFacebook: SocialUser;
    public messageAlert: string;
    public classAlert: string;

    constructor( private loginService: AuthenticationService,
                 private benefitsService: BenefitsService,
                 private storageService: StorageService,
                 private authService: AuthService ) { 
    }

    ngOnInit() {
        this.isLogged = this.storageService.isAuthenticated();
        if (!this.isLogged) {
            this.showMessage("warning", "No se encontró usuario logeado");
        } else {
            this.searchSources();
            this.data = this.initData();
            this.selectedSources = this.data.suscripcionesCodigo;
        } 
    }

    // Init data
    initData() {
        let data = this.storageService.getCurrentUser();
        return { 
            idUser: data.idUser,
            nombres: data.nombres, 
            apellidos: data.apellidos, 
            correo: this.maskEmail(data.correo), 
            alias: data.alias,
            tipoDocumento: data.tipoDocumento,
            numeroDocumento: this.mask(data.numeroDocumento),
            telefono: this.mask(data.telefono), 
            // sexo: data.sexo,  codigoReferido: data.codigoReferido,
            suscripcionesCodigo: (data.suscripcionesCodigo ? data.suscripcionesCodigo : []),
            codigoPromocion: data.codigoPromocion,
            idRedSocial: data.idRedSocial,
            rutaFotoLarge: ( data.rutaFotoLarge ? data.rutaFotoLarge : 'assets/img/placeholder-photo.png'),
            tokenRedSocial: data.tokenRedSocial
        };
    }

    // Botón siguiente
    editSuscriptions() {
        this.showDatosBasicos = false;
        if (this.availableSources.length > 0) {
            this.checkedSources();
        }
    }
    
    // Botón Anterior
    btnPrevSuscriptions(value) {
        this.data.suscripcionesCodigo = this.selectedSources;
        this.showDatosBasicos = true;
    } 

    // Guardar usuario
    sendData(value) {
        this.data.suscripcionesCodigo = this.selectedSources;
        let param = {
            idUser: this.data.idUser,
            suscripcionesCodigo: this.data.suscripcionesCodigo
        };
        this.spinner = true;
        this.loginService.saveSubscriptions(param).subscribe(
            data => {
                this.storageService.setCurrentSession(this.data);
                this.spinner = false;
                this.showMessage("info", "Datos actualizados correctamente");
                this.showDatosBasicos = true;
            },
            error => {
                console.log(error);
                this.showMessage("danger", ErrorServiceMessage);
            }
        ); 
    }

    // Enmascarar Datos 
    mask(data) {
        let c = data.length;
        let final = data.substring(c - 4, c);
        data = final.padStart(c,'*');
        return data;
    }

    maskEmail(data) {
        let part = data.split("@");
        let c = part[0].length;
        let final = part[0].substring(c - 4, c);
        data = final.padStart(c,'*') + "@" + part[1];
        return data;
    }

    // Feedback formContact
    showMessage(c, t) {
        this.messageAlert = t;
        this.classAlert = "alert-" + c;
        setTimeout(() => { this.messageAlert = ""; }, 5000);
    }
  
    /***************
     *  Facebook
     ***************/
    signInWithFB() {
        this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
        this.authService.authState.subscribe((user) => {
            if (user) {
                this.userFacebook = user;
                this.updateUser();
            } 
          });
    }
    signOut(): void {
        this.authService.signOut();
    }

    updateUser() {
        this.spinnerFb = true;
        // Actualiza Local 
        this.data.idRedSocial = this.userFacebook.id;
        this.data.rutaFotoLarge = this.userFacebook.photoUrl;
        this.data.tokenRedSocial = this.userFacebook.authToken;
        this.storageService.setCurrentSession(this.data);

        // Actualiza en Usuarios
        let param = {
          "idUser": this.data.idUser,
          "numeroDocumento": this.data.numeroDocumento,
          "idRedSocial": this.userFacebook.id,
          "rutaFotoLarge": this.userFacebook.photoUrl,
          "tokenRedSocial": this.userFacebook.authToken,
          "correo": this.userFacebook.email
        }
        this.loginService.updateUser(param).subscribe(
          data => {
              this.spinnerFb = false;
              if (!data.data && !data.listData) {
                this.showMessage("danger", data.error.message);
              } else {
                 // console.log(data);
              }
            },
          error => {
              this.spinnerFb = false;
              console.log(error);
              this.showMessage("danger", ErrorServiceMessage);
            }
        );
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
            nodo = this.availableSources.findIndex(({ id }) => id === sources[i] );
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
                    this.availableSources = this.availableSources.filter(({ tipoSuscripcion }) => tipoSuscripcion === "1" );
                    let c = this.availableSources.length;
                    for (let i = 0; i < c; i++) {
                        this.availableSources[i].checked = false;
                    }
                }             
            },
            error => {
                console.log(error);
                this.showMessage("danger", ErrorServiceMessage );
            }
        );
    } 
}
