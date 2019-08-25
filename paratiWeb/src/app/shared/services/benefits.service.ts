import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable } from 'rxjs/Rx';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { URLService } from '../shared.data';

@Injectable()
export class BenefitsService {

  private basePath = URLService;
  private path;

  constructor(private http: HttpClient) { }

  // Obtener Beneficios en Home
  getBenefitsHome(param): Observable<any> {
    this.path = 'benefits';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Resumen Beneficios en Home
  getBenefitsTotal(param): Observable<any> {
    this.path = 'benefits/count'; 
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Beneficio por ID
  getBenefitById(param): Observable<any> {
    this.path = 'benefits/id';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Beneficio por Texto
  getBenefitByText(param): Observable<any> {
    this.path = 'search/ByText';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Beneficio por Categoria
  getBenefitByCategories(param): Observable<any> {
    this.path = 'search/byRubroAndPosition';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Lista de Favoritos
  getFavorites(param): Observable<any> {
    this.path = 'benefits/favorites';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Lista de Ver Más Tarde
  getSeeLater(param): Observable<any> {
    this.path = 'benefits/seeLater';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Lista de Categorias
  getCategoriesList(param): Observable<any> {
    this.path = 'search/categories';   
    return this.http.post(this.getUrl(this.path), param);
  }

  // Obtener Lista de Fuentes de suscripcion
  getSourcesList(param): Observable<any> {
    this.path = 'search/sources';   
    return this.http.post(this.getUrl(this.path), param);
  }

  // Guardar datos de contacto
  leadSave(param): Observable<any> {
    this.path = 'lead/save';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Guardar tracking en registro de usuarios
  saveTrackingRegister(param): Observable<any> {
    this.path = 'tracking/register';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Actualizar Flags
  updateFlags(param): Observable<any> {
    this.path = 'benefits/updateFlagsBenefit';   
    return this.http.post(this.getUrl(this.path), param);
  }

  // URL del servicio
  private getUrl(path) {
    return (this.basePath + path);
  }

}
