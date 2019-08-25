import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionCarrouselComponent } from './section-carrousel.component';
import { BenefitCardComponent } from '../benefit-card/benefit-card.component';
import { BenefitThumbComponent } from '../benefit-thumb/benefit-thumb.component';

describe('SectionCarrouselComponent', () => {
  let component: SectionCarrouselComponent;
  let fixture: ComponentFixture<SectionCarrouselComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        SectionCarrouselComponent,
        BenefitCardComponent,
        BenefitThumbComponent
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectionCarrouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
