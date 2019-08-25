import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormControl, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { BenefitCardComponent } from './components/benefit-card/benefit-card.component';
import { BenefitThumbComponent } from './components/benefit-thumb/benefit-thumb.component';
import { ShowImagesComponent } from './components/show-images/show-images.component';
import { DownloadappComponent } from './components/downloadapp/downloadapp.component';
import { NavigateBackComponent } from './components/navigate-back/navigate-back.component';
import { ShowMessageComponent } from './components/show-message/show-message.component';
import { ShowIncentiveComponent } from './components/show-incentive/show-incentive.component';
import { ShowAlertComponent } from './components/show-alert/show-alert.component';
import { ShowLogoComponent } from './components/show-logo/show-logo.component';
import { LoginComponent } from './components/login/login.component';
import { FormContactComponent } from './components/form-contact/form-contact.component';
import { ConfirmationPopoverModule } from 'angular-confirmation-popover';
import { NguiInViewComponent } from './components/ngui-in-view.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        NgbModule,
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.circle,
            backdropBackgroundColour: 'rgba(0,0,0,0.02)',
            fullScreenBackdrop: true,
            primaryColour: 'rgba(102, 44, 212, 1)',
            secondaryColour: 'rgba(113, 125, 214, 0.2)',
            tertiaryColour: '#FFF'
        }),
        ConfirmationPopoverModule.forRoot({
            confirmButtonType: 'danger' // set defaults here
          })
    ],
    declarations: [
        BenefitCardComponent,
        BenefitThumbComponent,
        ShowImagesComponent,
        DownloadappComponent,
        NavigateBackComponent,
        ShowMessageComponent,
        ShowIncentiveComponent,
        ShowLogoComponent,
        ShowAlertComponent,
        LoginComponent,
        FormContactComponent,
        NguiInViewComponent
    ],
    providers: [
    ],
    exports: [
        BenefitCardComponent,
        BenefitThumbComponent,
        DownloadappComponent,
        NavigateBackComponent,
        ShowImagesComponent,
        ShowMessageComponent,
        ShowIncentiveComponent,
        ShowLogoComponent,
        ShowAlertComponent,
        LoginComponent,
        FormContactComponent,
        FormsModule,
        ReactiveFormsModule,
        LoadingModule,
        NgxPaginationModule,
        NguiInViewComponent
    ]
})
export class SharedModule { }