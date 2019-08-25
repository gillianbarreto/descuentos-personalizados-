import { Component, OnInit } from '@angular/core';
import { sectionBenefit } from '../../models/setting-benefits';
import { BenefitsService } from '../../services/benefits.service';
import { StorageService } from '../../services/storage.service';
import { Subject } from 'rxjs';

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-rubros',
  templateUrl: './rubros.component.html',
  styleUrls: ['./rubros.component.scss'],
  providers: [BenefitsService, StorageService]
})
export class RubrosComponent implements OnInit {

  public sections: sectionBenefit[];
  public viewHome;
  public geo;
  public loading = false;
  public latitude;
  public longitude;
  private onBrowser;

  public static updateView: Subject<boolean> = new Subject();

  constructor(private benefitsService: BenefitsService,
              private storageService: StorageService,
              @Inject(PLATFORM_ID) private platformId: Object) {
    RubrosComponent.updateView.subscribe(res => {
      this.getRubros();
    })
    this.onBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Localizacion del usuario
    this.latitude = 0;
    this.longitude = 0;
    // Muestra vista por defecto
    this.showView();
    this.getLocation();
  }

  // Obtener Ubicacion del Usuario
  getLocation() {
    if (this.onBrowser) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => {
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
            this.geo = this.storageService.getGeo();
            if (this.geo) {
              if (this.geo.latitude !== this.latitude || this.geo.longitude !== this.longitude) {
                this.updateGeo();
              }
            } else {
              this.updateGeo();
            }
          },
          error => {
            switch (error.code) {
              case 1:
                console.log('Permission Denied');
                break;
              case 2:
                console.log('Position Unavailable');
                break;
              case 3:
                console.log('Timeout');
                break;
            }
          }
        );
      } else {
        console.log('No hay servicio de Geolocalización')
      }
    } 
  }

  // Muestra rubros 
  showView() {
    // Verifica si hay datos en el storage
    this.viewHome = this.storageService.getViewHome();
    if (this.viewHome) {
      this.sections = this.viewHome;
    // Si no, va al servicio
    } else {
      this.getRubros();
    }
  }
  // Actualiza Geo y lee nuevamente servicio
  updateGeo() {
     this.storageService.setGeo({ latitude: this.latitude, longitude: this.longitude });
     this.getRubros();
  }
  // Obtiene los rubros 
  getRubros() {
    this.loading = true;
    let doc = " ";
    let idUsr = " ";
    if (this.storageService.isAuthenticated()) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc,
      "latitud": this.latitude,
      "longitud": this.longitude
    };
    this.benefitsService.getBenefitsHome(param).subscribe(
      data => {
        this.loading = false;
        if (!data) {
          console.log('NO hay datos');
        } else {
          this.sections = data.listData;
          // Marca destacados
          let c = this.sections.length;
          for (let i = 0; i < c; i++) {
            if (this.sections[i].idSection === "CODSEC0000001") {
              let destacados = this.sections[i].benefit;
              let d = destacados.length;
              for (let j = 0; j < d; j++) {
                this.sections[i].benefit[j].destacados = true;
              }
            }
          }
          // Guarda los datos en el Storage para no volver a llamar al servicio
          this.storageService.setViewHome(this.sections);
        }
      },
      error => {
        this.loading = false;
        console.log(error);
      }
    );
  }

}
