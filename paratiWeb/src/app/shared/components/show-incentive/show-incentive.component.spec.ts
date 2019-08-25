import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowIncentiveComponent } from './show-incentive.component';

describe('ShowIncentiveComponent', () => {
  let component: ShowIncentiveComponent;
  let fixture: ComponentFixture<ShowIncentiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowIncentiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowIncentiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
