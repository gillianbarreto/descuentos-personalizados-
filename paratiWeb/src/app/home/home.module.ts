import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { RubrosComponent } from '../shared/components/rubros/rubros.component';
import { SectionCarrouselComponent } from '../shared/components/section-carrousel/section-carrousel.component';
import { SharedModule } from '../shared/shared.module';

import { MDBBootstrapModule } from 'angular-bootstrap-md';

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        SharedModule,
        MDBBootstrapModule.forRoot(),
    ],
    schemas: [ NO_ERRORS_SCHEMA  ],
    declarations: [ 
        HomeComponent,
        RubrosComponent,
        SectionCarrouselComponent
    ],
    exports:[ HomeComponent, SharedModule ],
    providers: []
})
export class HomeModule { }
