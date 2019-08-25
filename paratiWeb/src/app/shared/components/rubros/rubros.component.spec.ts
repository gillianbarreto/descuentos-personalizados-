import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RubrosComponent } from './rubros.component';
import { SectionCarrouselComponent } from '../section-carrousel/section-carrousel.component';
import { BenefitCardComponent } from '../benefit-card/benefit-card.component';
import { BenefitThumbComponent } from '../benefit-thumb/benefit-thumb.component';

describe('RubrosComponent', () => {
  let component: RubrosComponent;
  let fixture: ComponentFixture<RubrosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        RubrosComponent,
        SectionCarrouselComponent,
        BenefitCardComponent,
        BenefitThumbComponent
       ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RubrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
