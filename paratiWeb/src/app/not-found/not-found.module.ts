import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NotFoundComponent } from './not-found.component';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        NotFoundRoutingModule,
        RouterModule,
        SharedModule
    ],
    declarations: [NotFoundComponent]
})
export class NotFoundModule {}
