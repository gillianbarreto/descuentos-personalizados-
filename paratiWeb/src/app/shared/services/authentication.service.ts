import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// import { Observable } from 'rxjs/Rx';
import { Observable } from 'rxjs';
import { Session } from '../models/setting-session';
import { URLService } from '../shared.data';

@Injectable()
export class AuthenticationService {

  private basePath = URLService;
  private path;

  constructor(private http: HttpClient) { }

  // Verificar usuario 
  login(param): Observable<any> {
    this.path = 'login';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Verificar codigo Otp
  validateOtp(param): Observable<any> {
    this.path = '/login/otpKeyValidation';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Registrar Usuario
  signUp(param): Observable<any> {
    this.path = '/login/saveCustomerInfo';
    return this.http.post(this.getUrl(this.path), param);
  }

  // Recuperar datos de usuarios - Requiere Token y correo
  retrieveUser(param): Observable<any> {
    this.path = '/login/retrieveCustomerInfo';
    return this.http.post(this.getUrl(this.path), param);
  } 

  // Recuperar datos de usuarios
  updateUser(param): Observable<any> {
    this.path = '/login/updateCustomerInfo';
    return this.http.post(this.getUrl(this.path), param);
  } 

  // Guardar Fuentes de Suscripcion para el usuario
  saveSubscriptions(param): Observable<any> {
    this.path = '/login/saveSubscriptions';
    return this.http.post(this.getUrl(this.path), param);
  }

   // Recuperar datos de usuarios - Requiere Token y correo
  getTerms(param): Observable<any> {
    this.path = '/legal/getTerms';
    return this.http.post(this.getUrl(this.path), param);
  } 

  // URL del servicio
  private getUrl(path) {
    return (this.basePath + path);
  }
}
