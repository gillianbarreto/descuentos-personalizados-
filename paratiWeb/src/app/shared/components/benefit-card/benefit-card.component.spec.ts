import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitCardComponent } from './benefit-card.component';
import { BenefitThumbComponent } from '../benefit-thumb/benefit-thumb.component';

describe('BenefitCardComponent', () => {
  let component: BenefitCardComponent;
  let fixture: ComponentFixture<BenefitCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
          BenefitCardComponent, 
          BenefitThumbComponent  
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
