import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BenefitThumbComponent } from './benefit-thumb.component';

describe('BenefitThumbComponent', () => {
  let component: BenefitThumbComponent;
  let fixture: ComponentFixture<BenefitThumbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitThumbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitThumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
