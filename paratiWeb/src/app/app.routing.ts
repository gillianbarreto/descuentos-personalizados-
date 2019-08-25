import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { BenefitDetailComponent } from './benefits/benefit-detail/benefit-detail.component';
import { BenefitListComponent } from './benefits/benefit-list/benefit-list.component';

const routes: Routes = [
    { path: 'home',
      data: { title: 'Los mejores Descuentos para ti, en un solo lugar' },
      component: HomeComponent },
    { path: 'user-profile',
      data: { title: 'Actualiza tu Perfil de Usuario' },
      component: ProfileComponent },
    { path: 'signup',
      data: { title: 'Registrate para Obtener Mejores Sugerencias' },
      component: SignupComponent },
    { path: 'descuentos/:id/:search',
      data: { title: 'Lista de Descuentos para Ti' },
      component: BenefitListComponent },
    { path: 'descuento/:id',
      data: { title: 'Detalle de Descuento' },
      component: BenefitDetailComponent },
    { path: 'not-found', component: NotFoundComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: 'not-found' }
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
  ],
})
export class AppRoutingModule { }
