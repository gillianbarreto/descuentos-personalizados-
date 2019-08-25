import { NgModule } from '@angular/core';
import { SignupComponent } from './signup.component';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from "@angular/common";
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [ 
        CommonModule,
        RouterModule,
        SharedModule 
    ],
    declarations: [ 
        SignupComponent
    ],
    providers: [ ]

})
export class SignUpModule {}