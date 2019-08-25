import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Session, User } from '../models/setting-session';

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class StorageService {

  private onBrowser;
  private localStorageService;
  private currentSession: Session = null;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
              private router: Router) { 
    this.onBrowser = isPlatformBrowser(this.platformId);
    if (this.onBrowser) {
      this.localStorageService = localStorage;
      this.currentSession = this.loadSessionData();
    }
  }

  /** Iniciar Session **/
  setCurrentSession(data: User): void {
    if (this.onBrowser) {
      this.currentSession = { token: "999", user: data };  // close tab
      this.localStorageService.setItem('currentUser', JSON.stringify(this.currentSession)); // persistent
      this.localStorageService.setItem('isLoggedin', 'true');
    }
  }

  /* Actualizar datos de Suscripciones en Local */
  setSuscriptions(data: User): void {
    if (this.onBrowser) {
      let updateSession = data;
      this.localStorageService.setItem('currentUser', JSON.stringify(updateSession)); 
    }
  }

  /** Obtener datos de la Session **/
  getCurrentSession(): Session {
    return this.currentSession;
  }
  loadSessionData(): Session {
    if (this.onBrowser) {
      const sessionStr = this.localStorageService.getItem('currentUser');
      return (sessionStr) ? <Session>JSON.parse(sessionStr) : null;
    } else
      return null;
  }
  getCurrentToken(): string {
    if (this.onBrowser) {
      const session = this.getCurrentSession();
      return (session && session.token) ? session.token : null;
    } else
      return null;
  };

  /** Eliminar Session **/
  removeCurrentSession(): void {
    if (this.onBrowser) {
      this.currentSession = null;
      this.localStorageService.removeItem('currentUser');
      this.localStorageService.removeItem('isLoggedin');
      this.removeViewHome();
      this.removeGeo();
      this.removeViewList();
    } 
  }

 /** Logout **/
  logout(): void {
    if (this.onBrowser) {
     this.removeCurrentSession();
    } 
  }

  /** Verificar usuario logeado **/
  isAuthenticated(): boolean {
    let isLoggedin;
    if (this.onBrowser) {
      isLoggedin = this.localStorageService.getItem('isLoggedin');
    } else {
      isLoggedin = false;
    }
    return (isLoggedin === 'true') ? true : false;
  };

  /** Devolver datos de usuario logeado **/
  getCurrentUser(): User {
    if (this.onBrowser) {
      const session: Session = this.getCurrentSession();
      return (session && session.user) ? session.user : null;
    } else 
      return null;
  };
  getCurrentUserEmail() {
    if (this.onBrowser) {
      const session: Session = this.getCurrentSession();
      return (session && session.user.correo) ? session.user.correo : null;
    } else
     return null;
  };
  getCurrentUserAlias() {
    if (this.onBrowser) {
      const session: Session = this.getCurrentSession();
      return (session && session.user.alias) ? session.user.alias : null;
    } else 
      return null;
  };
  getCurrentUserDocument() {
    if (this.onBrowser) {
      const session: Session = this.loadSessionData();
      return (session && session.user.numeroDocumento) ? session.user.numeroDocumento : null;
    } else 
      return null;
  };
  getCurrentUserID() {
    if (this.onBrowser) {
      const session: Session = this.loadSessionData();
      return (session && session.user.idUser) ? session.user.idUser : null;
    } else 
      return null;
  };

  /** Data de Descuentos Home **/
  setViewHome(data): void {
    if (this.onBrowser) {
      this.localStorageService.setItem('viewHome', JSON.stringify(data)); 
    } 
  }
  getViewHome() {
    if (this.onBrowser) {
      const viewHome = this.localStorageService.getItem('viewHome');
      return (viewHome) ? JSON.parse(viewHome) : null;
    } else 
      return null;
  }
  removeViewHome() {
    if (this.onBrowser) {
      this.localStorageService.removeItem('viewHome');
    }
  }
  updateViewHome(param) {
    if (this.onBrowser) {
      let viewHome = this.getViewHome();
      if (!viewHome) return;
      let c = viewHome.length; 
      let id = param.idGrupoBeneficio;
      let newSections = [];
      // Condicionado por request/response de servicios 
      param.flagFavoritos = ( param.flagFavoritos == 1 ? true : false );
      param.flagMeInteresa = ( param.flagMeInteresa == 1 ? true : false );
      param.flagNoMeInteresa = ( param.flagNoMeInteresa == 1 ? true : false );
      param.flagVerMasTarde = ( param.flagVerMasTarde == 1 ? true : false );
      for (let i = 0; i < c; i++) {
        let benefits = viewHome[i].benefit;
        let newBenefits = [];
        let d = benefits.length;
        for (let j = 0; j < d; j++) {
          if (benefits[j].idBenefit === id) {
            benefits[j].favorite = param.flagFavoritos;
            benefits[j].flagInterest = param.flagMeInteresa;
            benefits[j].flagNotInterest = param.flagNoMeInteresa;
            benefits[j].flagSeeLater = param.flagVerMasTarde;
          }
          newBenefits.push(benefits[j]);
        }
        newSections.push({ descriptionSection: viewHome[i].descriptionSection, 
                          idSection: viewHome[i].idSection,  
                          tittleSection: viewHome[i].tittleSection, 
                          benefit: newBenefits } 
                        );
      } 
      // Actualiza 
      this.setViewHome(newSections);
    } 
  }
  /* Localizacion del usuario */
  setGeo(data): void {
    if (this.onBrowser) {
      this.localStorageService.setItem('geo', JSON.stringify(data)); 
    } 
  }
  getGeo() {
    if (this.onBrowser) {
      const geo = this.localStorageService.getItem('geo');
      return (geo) ? JSON.parse(geo) : null;
    } else 
      return null;
  }
  removeGeo() {
    if (this.onBrowser) {
      this.localStorageService.removeItem('geo');
    }
  }
  
  /** Data de Descuentos por Texto, Favorito, Ver Mas Tarde **/
  setViewList(text, data, rubros, filter): void {
    if (this.onBrowser) {
      const dataText = { text: text, data: data, rubros: rubros, filter: filter }
      this.localStorageService.setItem('viewList', JSON.stringify(dataText)); 
    }
  }
  getViewList() {
    if (this.onBrowser) {
      const viewList = this.localStorageService.getItem('viewList');
      return (viewList) ? JSON.parse(viewList) : null;
    } else
      return null;
  }
  removeViewList() {
    if (this.onBrowser) {
      this.localStorageService.removeItem('viewList');
    }
  }
  updateViewList(param, card) {
    if (this.onBrowser) {
      let viewList = this.getViewList();
      if (!viewList) return;
      let benefits = viewList.data.benefit;
      let newBenefits = []; 
      let id = param.idGrupoBeneficio;
      let c = benefits.length; 
      let found = false;
      let del = false;
      // Condicionado por request/response de servicios 
      param.flagFavoritos = ( param.flagFavoritos == 1 ? true : false );
      param.flagMeInteresa = ( param.flagMeInteresa == 1 ? true : false );
      param.flagNoMeInteresa = ( param.flagNoMeInteresa == 1 ? true : false );
      param.flagVerMasTarde = ( param.flagVerMasTarde == 1 ? true : false );
      // Busca descuento y actualiza
      for (let i = 0; i < c; i++) {
        if (benefits[i].idBenefit === id) {
            // Elimina el descuento de la lista
            if ((!param.flagFavoritos && viewList.text === "favorites") || 
              (!param.flagVerMasTarde && viewList.text === "seeLater")) {
                // console.log(benefits[i]);
            } else {
              benefits[i].favorite = param.flagFavoritos; 
              benefits[i].flagInterest = param.flagMeInteresa;
              benefits[i].flagNotInterest = param.flagNoMeInteresa;
              benefits[i].flagSeeLater = param.flagVerMasTarde;
              newBenefits.push(benefits[i]);
            }
            found = true;
        } else {
          newBenefits.push(benefits[i]);
        }
      } 
      // Si no lo consigue en la lista, lo agrega (favoritos, ver mas tarde)
      if (!found) {
        card.carrousel = false;
        card.favoriteList = (param.flagFavoritos && viewList.text === "favorites");
        card.seeLaterList = (param.flagVerMasTarde && viewList.text === "seeLater");
        card.favorite = param.flagFavoritos; 
        card.flagInterest = param.flagMeInteresa;
        card.flagNotInterest = param.flagNoMeInteresa;
        card.flagSeeLater = param.flagVerMasTarde;
        newBenefits.push(card);
      } 
      // Actualiza 
      this.setViewList(viewList.text, 
                      { tittleSection: viewList.data.tittleSection, descriptionSection: viewList.data.descriptionSection, benefit: newBenefits },
                      viewList.rubros, 
                      viewList.filter);
    }
  }

}
