import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BenefitDetailComponent } from './benefit-detail.component';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { NguiMapModule} from '@ngui/map';

describe('BenefitDetailComponent', () => {
  let component: BenefitDetailComponent;
  let fixture: ComponentFixture<BenefitDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BenefitDetailComponent ],
      imports: [
        SharedModule,
        NguiMapModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BenefitDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
