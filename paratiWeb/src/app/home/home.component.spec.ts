import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';

import { RubrosComponent } from '../shared/components/rubros/rubros.component';
import { SectionCarrouselComponent } from '../shared/components/section-carrousel/section-carrousel.component';
import { HomeComponent } from './home.component';

import { SharedModule } from '../shared/shared.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        RubrosComponent,
        SectionCarrouselComponent
      ],
      imports: [
        CommonModule,
        BrowserModule,
        FormsModule,
        RouterModule,
        SharedModule,
        HttpClientModule,
        MDBBootstrapModule.forRoot()
      ],
      schemas: [ NO_ERRORS_SCHEMA  ],
      providers: []
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
