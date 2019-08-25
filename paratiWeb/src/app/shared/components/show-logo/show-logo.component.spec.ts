import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowLogoComponent } from './show-logo.component';

describe('ShowLogoComponent', () => {
  let component: ShowLogoComponent;
  let fixture: ComponentFixture<ShowLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
