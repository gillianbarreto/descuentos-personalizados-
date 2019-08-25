import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { NguiMapModule} from '@ngui/map';

import { BenefitDetailComponent } from './benefit-detail.component';

@NgModule({
  imports: [
      CommonModule,
      BrowserModule,
      FormsModule,
      RouterModule,
      SharedModule,
      NgbModule,
      NguiMapModule
  ],
  declarations: [ 
    BenefitDetailComponent 
  ],
  exports:[ 
    BenefitDetailComponent 
  ],
  providers: []
})
export class BenefitDetailModule { }
