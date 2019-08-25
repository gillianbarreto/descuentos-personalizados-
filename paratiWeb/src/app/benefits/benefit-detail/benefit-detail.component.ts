import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BenefitsService } from '../../shared/services/benefits.service';
import { StorageService } from '../../shared/services/storage.service';
import { Subject } from 'rxjs';
import { DirectionsRenderer } from '@ngui/map';
import { cardBenefit } from '../../shared/models/setting-benefits';

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare var $;

@Component({
  selector: 'app-benefit-detail',
  templateUrl: './benefit-detail.component.html',
  styleUrls: ['./benefit-detail.component.scss'],
  providers: [BenefitsService, StorageService]
})
export class BenefitDetailComponent implements OnInit, OnDestroy {

  @ViewChild(DirectionsRenderer) directionsRendererDirective: DirectionsRenderer;

  public directionsRenderer: google.maps.DirectionsRenderer;
  public directionsResult: google.maps.DirectionsResult;
  public direction = null;
  public latitude;
  public longitude;
  private onBrowser;
  public id;
  public sub: any;
  public bs: any;
  public card: cardBenefit;
  public loading = false;
  public info: any;
  public sede: any;
  public isLogged: boolean = false;

  public static updateView: Subject<boolean> = new Subject();

  constructor(private route: ActivatedRoute,
              private benefitsService: BenefitsService,
              private storageService: StorageService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    BenefitDetailComponent.updateView.subscribe(res => {
      this.getDetail();
    })
    this.onBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    this.latitude = 0;
    this.longitude = 0;
    // Muestra vista por defecto mientras espera confirmacion del usuario
    this.getDetail();
    // Localizacion del usuario
    if (this.onBrowser) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            // Vuelve a actualizar la vista con la ubicación
            this.getDetail();
          },
          error => {
            switch (error.code) {
              case 1:
                console.log('Geo: Permission Denied');
                break;
              case 2:
                console.log('Geo: Position Unavailable');
                break;
              case 3:
                console.log('Geo: Timeout');
                break;
            }
          }
        );
      } else {
        console.log('No hay servicio de Geolocalización')
      }
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.bs.unsubscribe();
  }

  initView() {
    this.isLogged = this.storageService.isAuthenticated();
  }

  // Busca Detalle de Beneficio
  getDetail() {
    this.initView();
    // Id del Beneficio 
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
    });
    // Documento del Usuario Logeado
    let doc = " ";
    let idUsr = " "
    if (this.isLogged) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc,
      "idGrupoBeneficio": this.id,
      "longitud": this.longitude,
      "latitud": this.latitude
    };
    this.loading = true;
    this.bs = this.benefitsService.getBenefitById(param).subscribe(
      data => {
        if (data && data.data.length === 0) {
          this.showMessage(100);
        } else {
          this.card = data.data;
          this.card.detail = true;
          //console.log(data.data);
          this.card.destacados = (this.card.flagDestacado ? true : false);
          if (this.card['idBenefit']) {
            // Formatea contenido
            this.card.resumenBenefit.replace(/(?:\r\n|\r|\n)/g, '<br />');
            this.card.descriptionBenefit.replace(/(?:\r\n|\r|\n)/g, '<br />');
            this.card.termsAndConditions.replace(/(?:\r\n|\r|\n)/g, '<br />');
            // Busca primera sede
            if (this.card.locals.length > 0) {
              $("#sede-0").click(this.showSedes(this.card.locals[0]));
            }
          } else {
            this.card = null;
            this.showMessage(100);
          }
        }
        this.loading = false;
      },
      error => {
        // console.log(error);
        this.loading = false;
        this.showMessage(500);
      }
    );
  }

  // Mostrar mensaje de Notificación
  showMessage(n) {
    this.info = { class: "danger", code: n };
  }

  // Cambiar valores de Sedes
  public showSedes(local) {
    this.sede = {
      establecimiento: local.establecimiento,
      direccion: local.direccion,
      latitud: local.latitud,
      longitud: local.longitud,
      posicion: [this.convertStringToNumber(local.latitud), this.convertStringToNumber(local.longitud)],
      horario: local.horario
    }
    this.direction = null;
  }

  // Pasar latitud y longitud a numero
  public convertStringToNumber(value: string): number {
    return parseFloat(value);
  }

  // Ir al beneficio
  goNow(position) {
    this.direction = {
      origin: new google.maps.LatLng(this.convertStringToNumber(this.latitude), this.convertStringToNumber(this.longitude)),
      destination: new google.maps.LatLng(position[0], position[1]),
      travelMode: 'DRIVING'
    };
  }

}
