import { TransferHttpCacheModule } from '@nguniversal/common';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { NguiMapModule } from '@ngui/map';
import { IDFacebook } from './shared/shared.data';

import { HomeModule } from './home/home.module';
import { BenefitDetailModule } from './benefits/benefit-detail/benefit-detail.module';
import { BenefitListModule } from './benefits/benefit-list/benefit-list.module';
import { NotFoundModule } from './not-found/not-found.module';
import { ProfileModule } from './profile/profile.module';
import { SignUpModule } from './signup/signup.module';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ShowLegalComponent } from './shared/components/show-legal/show-legal.component';

// Manejo de Cache
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

// Login con Facebook
import { SocialLoginModule, AuthServiceConfig } from "angular4-social-login";
import { FacebookLoginProvider } from "angular4-social-login";

let config = new AuthServiceConfig([
  {
    id: FacebookLoginProvider.PROVIDER_ID,
    provider: new FacebookLoginProvider(IDFacebook)
  },
]);
export function provideConfig() {
  return config;
}

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    ShowLegalComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'para-ti-web'}),
    HttpClientModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBZRPMdTQFS9s4VC7M27PGw5IJVPoegadw'
    }),
    HomeModule,
    BenefitListModule,
    BenefitDetailModule,
    NotFoundModule,
    ProfileModule,
    SignUpModule,
    SocialLoginModule,
    TransferHttpCacheModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    {
      provide: AuthServiceConfig,
      useFactory: provideConfig
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(this.platformId) ? 'browser' : 'server';
    console.log("Run on the ", platform);
    // Flags para prevenir fallos por versiones cacheadas
    window['MY_APP_IS_RUNNING'] = true;
  }
}
