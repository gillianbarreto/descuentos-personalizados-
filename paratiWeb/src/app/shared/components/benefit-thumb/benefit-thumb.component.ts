import { Component, OnInit, Input } from '@angular/core';
import { cardBenefit} from '../../models/setting-benefits';
import { BenefitsService } from '../../services/benefits.service';
import { StorageService } from '../../services/storage.service';
import { ErrorServiceMessage } from '../../shared.data';
import { BenefitListComponent } from '../../../benefits/benefit-list/benefit-list.component';
import { Router } from '@angular/router';
//import { Subject } from 'rxjs/Subject';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-benefit-thumb',
  templateUrl: './benefit-thumb.component.html',
  styleUrls: ['./benefit-thumb.component.scss'],
  providers: [ BenefitsService, StorageService ]
})
export class BenefitThumbComponent implements OnInit {

  @Input() card: cardBenefit;

  public altImg;
  public classImg;
  public sizeImg;
  public isLogged;
  public flag;
  public info: any;
  public doc;
  public idUsr;
  public altNoMeInteresa = "No me interesa este descuento";
  public altMeInteresa = "Me interesa este descuento";
  public altFavorito = "Añadir/Quitar de Favoritos";
  public altVerMasTarde = "Ver más tarde este descuento";
  public placeTooltip;
  public update = false;

  public static updateView: Subject<boolean> = new Subject();

  constructor(private benefitsService: BenefitsService,
              private storageService: StorageService, 
              private router: Router) {
    BenefitThumbComponent.updateView.subscribe(res => {
      this.isUserLogged();
    })
  }

  ngOnInit() { 
    // console.log(this.card);
    this.placeTooltip = (this.card.detail ? 'bottom' : 'top');
    this.isUserLogged();
    this.flag = { 
        flagMeInteresa: this.card.flagInterest, 
        flagNoMeInteresa: this.card.flagNotInterest,
        flagFavoritos: this.card.favorite, 
        flagVerMasTarde: this.card.flagSeeLater
    }

    // Añadir width: auto a imagenes del detalle
    if (this.card.detail) {
      this.classImg = 'w-100 img-fluid rounded';
      this.sizeImg = '100';
    } else {
      this.classImg = 'card-img-bottom img-cover rounded';
      this.sizeImg = '100';
    }
    // Texto alternativo de la imagen
    if (this.card.rubroApp)
      this.altImg = this.card.rubroApp + " " + this.card.nameBenefit + " - Busca tu descuento en " + this.card.nameEstablishment;
    else
      this.altImg = this.card.nameBenefit + " - Busca tu descuento en " + this.card.nameEstablishment;
  }

  // Actualizar Flag Me Interesa
  meInteresa() {
    this.flag.flagMeInteresa = !this.flag.flagMeInteresa;
    if (this.flag.flagMeInteresa) 
      this.flag.flagNoMeInteresa = !this.flag.flagMeInteresa;
    this.flagUpdate();
  }
  // Actualizar Flag No Me Interesa
  noMeInteresa() {
    this.flag.flagNoMeInteresa = !this.flag.flagNoMeInteresa;
    if (this.flag.flagMeInteresa) 
      this.flag.flagMeInteresa = !this.flag.flagNoMeInteresa;
    this.flagUpdate();
  }
  // Actualizar Flag Ver Más Tarde
  verMasTarde() {
    this.flag.flagVerMasTarde = !this.flag.flagVerMasTarde;
    this.flagUpdate();
  }
  // Actualizar Flag Favorito
  favorito() {
    this.flag.flagFavoritos = !this.flag.flagFavoritos;
    this.flagUpdate();
  }

  deleteItemList() {
    // Actualiza flags segun la lista 
    if (this.card.favoriteList) {
      this.favorito();
    } else {
      this.verMasTarde();
    }
    this.update = true;
  }

  cancelDeleteItemList() {
    // console.log('vine para aca');
  }

  // Actualiza Flag 
  flagUpdate() {
    // Condicionado por diferencia en el requerst / response de cada servicio
    let param = {
      "flagFavoritos": (this.flag.flagFavoritos ? 1 : 0),
      "flagMeInteresa": (this.flag.flagMeInteresa ? 1 : 0),
      "flagNoMeInteresa": (this.flag.flagNoMeInteresa ? 1 : 0),
      "flagVerMasTarde": (this.flag.flagVerMasTarde ? 1 : 0),
      "idUser": this.idUsr,
      "dni": this.doc, 
      "idGrupoBeneficio": this.card.detail ? this.card.idGrupoBeneficio : this.card.idBenefit,
      "idBenefit": this.card.detail ? this.card.idBenefit : this.card.id
    }
    // console.log(param);
    this.benefitsService.updateFlags(param).subscribe(
      data => {

        // console.log(data);
          if (!data.data && !data.listData) {
             this.showMessage(data.error.message);
          } else {
            // console.log(data);
            // Actualiza flag en storage - Home 
            this.storageService.updateViewHome(param);
            // Actualiza flags en storage - Lista de Descuentos 
            this.storageService.updateViewList(param, this.card);
            // Actualiza vista si se elimino favorito o ver mas tarde
            if (this.update) {
              BenefitListComponent.updateView.next(true);
            }
          
          } 
        },
      error => {
          console.log(error);
          this.showMessage(ErrorServiceMessage);
        }
    );
  }

  // verifica que el usuario esté logeado
  isUserLogged() {
    this.isLogged = this.storageService.isAuthenticated();
    if (this.isLogged) {
      this.doc = this.storageService.getCurrentUserDocument();
      this.idUsr = this.storageService.getCurrentUserID();
    }
  }

  // Mostar detalle del descuento al hacer click
  showDetail() {
    this.router.navigate(['/descuento', this.card.idBenefit]);
  }

  // Mostrar mensaje de Notificación
  showMessage(n) {
    this.info = { class: "danger", code: n };
  } 

}





