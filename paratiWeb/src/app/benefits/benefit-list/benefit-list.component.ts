import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { sectionBenefit } from '../../shared/models/setting-benefits';
import { ActivatedRoute } from '@angular/router';
import { BenefitsService } from '../../shared/services/benefits.service';
import { StorageService } from '../../shared/services/storage.service';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

declare var $ :any;

@Component({
  selector: 'app-benefit-list',
  templateUrl: './benefit-list.component.html',
  styleUrls: ['./benefit-list.component.scss'],
  providers: [ BenefitsService, StorageService ]
})
export class BenefitListComponent implements OnInit, OnDestroy {

  public section: sectionBenefit;
  public originalSection: sectionBenefit;
  public filterSection: sectionBenefit;
  public benefits: any [];
  public listRubros;
  public search;
  public id;
  public sub: any;
  public bs: any;
  public showFilters = false;
  public loading = false;
  public info: any;
  public page: number = 1;
  public configPg = { previousLabel: "<", nextLabel: ">" };
  public isLogged: boolean = false;
  public viewHome;
  public viewList;

  public static updateView: Subject<boolean> = new Subject();

  constructor( private router: ActivatedRoute, 
               public  routers: Router, 
               private benefitsService: BenefitsService,
               private storageService: StorageService ) {
    BenefitListComponent.updateView.subscribe(res => {
      this.getList();
    })
              
  }

  ngOnInit() {
    this.getList();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    // this.bs.unsubscribe();
  }

  // Servicios según la busqueda
  getList() {
    this.initView();
    // Toma Parametros
    this.sub = this.router.params.subscribe(params => {
      if (params) {
        this.id = params['id'];
        this.search = params['search'];

        switch (this.id) {
          // Busca por Categorías
          case 'rubros':
            this.getListBenefit(this.search, false);
            break;
          // Busca por texto
          case 'search':
            this.getListBenefitByText(this.search);
            break;
          case 'favoritos':
            this.getListFavorites();
            break;
          case 'ver-mas-tarde':
            this.getListSeeLater();
            break;
          // Muestra primera categoria
          default:
            this.getListBenefit(this.search, true);
        }
      } else {
        this.id = "";
        this.search = "";
      }
    });
  }

  // Inicializar Busqueda
  initView() {
    $('#aviso').hide(0);
    this.isLogged = this.storageService.isAuthenticated();
    this.info = null;
  }

  // Mostrar mensajes 
  showMessage(n) {
    this.info = { class: "danger", code: n };
    this.section = null;
  }

  /*************************************************
   *  Obtener Lista de Beneficios - Misma de Home
   ************************************************/
  getListBenefit(id, first) {
    this.listRubros = [];
    this.showFilters = false;
    this.initView();
    // Verifica si hay datos en el storage
    this.viewHome = this.storageService.getViewHome();
    if (this.viewHome) {
      this.filterDataViewHome(this.viewHome, id, first);
      return;
    }
    // Si no, llama al servicio 
    this.loading = true;
    let doc = " "; 
    let idUsr = " "
    if (this.isLogged) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc,
      "latitud": 0, 
      "longitud": 0 
    };
    this.bs = this.benefitsService.getBenefitsHome(param).subscribe(
      data => {
        if (data.listData.length == 0) {
          this.showMessage(101);
        } else {
          // console.log(data);
          this.info = null
          this.filterDataViewHome(data.listData, id, first);
          // Guarda los datos en el Storage para no volver a llamar al servicio
          this.storageService.setViewHome(data.listData);
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

  // Filtrar datos y asignar a la vista 
  filterDataViewHome(data, id, first) {
    // Si no trae rubro, muestra el primero
    if (first) {
      this.section = data[0];
    // Busca rubro seleccionado
    } else {
      this.section = data.find(({ tittleSection }) => tittleSection === id);
      if (!this.section) {
        this.showMessage(101);
      }
    }
  }

  /******************************************
   *  Obtener lista de beneficios por Texto
   * ****************************************/
  getListBenefitByText(text) {

    // Verifica si hay datos en el storage
    if (this.isStoraged(text)) return;
  
    // Si no, llama al servicio 
    this.loading = true;
    let rubros: any [];  
    let c, d, e;  

    let doc = " "; 
    let idUsr = " "
    if (this.isLogged) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc,
      "textoInput": text
    };
    this.info = null;
    this.bs = this.benefitsService.getBenefitByText(param).subscribe(
      data => {
        // console.log(data);
        rubros = data.listData;
        c = rubros.length;
        if (c === 0) {
          this.showMessage(101);
        } else {
          this.makeFilter(rubros, "Resultados de tu búsqueda", "Descuentos encontrados con: " + text, c, text);
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.showMessage(500);
        }
    );
  }

  /******************************
  *  Obtener lista de Favoritos
  * *****************************/
  getListFavorites() {
    if (!this.isLogged) return;
   
    // Verifica si hay datos en el storage
    if (this.isStoraged('favorites')) return; 

    // Si no, llama al servicio 
    this.loading = true;
    let rubros: any [];  
    let c;  
    let doc = " "; 
    let idUsr = " "
    if (this.isLogged) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc
    };
    this.info = null;
    this.bs = this.benefitsService.getFavorites(param).subscribe(
      data => {
        rubros = data.listData;
        c = rubros.length;
        if (c === 0) {
          this.showMessage(101);
        } else {
          this.makeFilter(rubros, rubros[0].tittleSection, rubros[0].descriptionSection, c, 'favorites');
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.showMessage(500);
        }
    );
  }

  /***********************************
  *  Obtener lista de Ver Mas Tarde 
  * *********************************/ 
  getListSeeLater() {
    if (!this.isLogged) return;
   
    // Verifica si hay datos en el storage
    if (this.isStoraged('seeLater')) return; 

    // Si no, llama al servicio 
    this.loading = true;
    let rubros: any [];  
    let c;  
    let doc = " "; 
    let idUsr = " "
    if (this.isLogged) {
      doc = this.storageService.getCurrentUserDocument();
      idUsr = this.storageService.getCurrentUserID();
    }
    let param = {
      "idUser": idUsr,
      "numeroDocumento": doc
    };

    this.info = null;
    this.bs = this.benefitsService.getSeeLater(param).subscribe(
      data => {
        rubros = data.listData;
        // console.log(rubros);
        c = rubros.length;
        if (c === 0) {
          this.showMessage(101);
        } else {
          this.makeFilter(rubros, rubros[0].tittleSection, rubros[0].descriptionSection, c, 'seeLater');
        }
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
        this.showMessage(500);
        }
    );
  }

  /**********************
  * Mostrar Filtros
  ***********************/
  showFilter() {
    this.showFilters = !this.showFilters;
    if (!this.showFilters) {
        this.section = this.originalSection;
        // Actualiza el Storage 
        this.storageService.setViewList(this.search, this.originalSection, this.listRubros, null );
    }
  }

  // Filtrar lista por rubro seleccionado
  filterRubro(r) {
    this.benefits = this.originalSection.benefit;
    this.benefits = this.benefits.filter(({ rubro }) => rubro === r.name );
    if (!this.benefits) {
      this.showMessage(101);
      return;
    }
    this.section = { 
      tittleSection: "Resultados de tu búsqueda",
      descriptionSection: "Descuentos encontrados con: " + this.search + " en " + r.name,
      benefit: this.benefits
    }
    // Actualiza el Storage con el filtro
    this.storageService.setViewList(this.search, this.originalSection, this.listRubros, this.section );
  }

  // Arma filtros 
  makeFilter(rubros, title, subtitle, c, text) {
    let d, e;  
    this.benefits = [];
    this.listRubros = [];
    e = 0;
    // Agrupa los Beneficios sin separar por Rubro
    for (let i = 0; i < c; i++) {
      this.listRubros.push( { name: rubros[i].tittleSection, total: rubros[i].benefit.length } );
      d = rubros[i].benefit.length;
      // Une los beneficios 
      if (d > 0) {
        for (let j = 0; j < d; j++) {
          // Actualiza flags según la lista para uso de benefit-thumb
          rubros[i].benefit[j].destacados = (rubros[i].idSection === "CODSEC0000001");
          rubros[i].benefit[j].favoriteList = (this.id == 'favoritos');
          rubros[i].benefit[j].seeLaterList = (this.id == 'ver-mas-tarde');
          // Añade descuento a la lista
          this.benefits.push(rubros[i].benefit[j]);
          this.benefits[e].rubro = rubros[i].tittleSection;
          e++;
        }
      }
    }
    // Arma el resultado de la búsqueda
    if (this.benefits.length > 0) {
      this.section = { 
          tittleSection: title,
          descriptionSection: subtitle,
          benefit: this.benefits
      }
      // console.log(this.section);

      // Guarda datos originales para el filtrado
      this.originalSection = this.section;
      // Ordena Rubros Alfabeticamente
      this.listRubros.sort(function (a, b){
          return ((a.name < b.name) ? -1 : ((a.name > b.name) ? 1 : 0));
      })
      // Guarda los datos en el Storage para no volver a llamar al servicio
      this.storageService.setViewList(text, this.section, this.listRubros, null );
    } else {
      this.showMessage(101);
    }      
  }

  // Verifica si la Lista está en el Storage
  isStoraged(text)  {
    this.showFilters = false;
    this.initView();
    this.viewList = this.storageService.getViewList();
    if (this.viewList && this.viewList.text == text) {
      this.listRubros = this.viewList.rubros;
      this.originalSection = this.viewList.data;
      // Si hay filtros
      if (this.viewList.filter) {
        this.showFilters = true;
        this.section = this.viewList.filter;
      } else {
        this.showFilters = false;
        this.section = this.viewList.data;
      }
      return true;
    }
    return false;
  } 

  /*******************
  * Ir a registrarse 
  ********************/
  signUp() {
    this.routers.navigate(['/signup']);
  }

}
