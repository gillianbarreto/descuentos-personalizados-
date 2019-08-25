import { Component, OnInit, ElementRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { FormControl, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { StorageService } from '../../services/storage.service';

import { RubrosComponent } from '../rubros/rubros.component';
import { BenefitDetailComponent } from '../../../benefits/benefit-detail/benefit-detail.component';
import { BenefitListComponent } from '../../../benefits/benefit-list/benefit-list.component';
import { BenefitThumbComponent } from '../../../shared/components/benefit-thumb/benefit-thumb.component';

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { Subject } from 'rxjs';

declare var $ :any;

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    providers: [ StorageService ]
})
export class NavbarComponent implements OnInit {

    private toggleButton: any;
    private sidebarVisible: boolean;
    public searchBenefit;
    public spinner = false;
    public isLogged = false;
    public alias: string;
    private onBrowser;
    public static updateView: Subject<boolean> = new Subject();

    constructor( public location: Location, 
                 private element: ElementRef,
                 private router: Router,
                 private storageService: StorageService,
                 @Inject(PLATFORM_ID) private platformId: Object ) {
        this.sidebarVisible = false;
        NavbarComponent.updateView.subscribe(res => {
            this.isLogged = this.isLogin();
          })
        this.onBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        this.searchBenefit = new FormControl();
        this.isLogged = this.isLogin();
    }
    
    /************ 
     * Navbar
     ************/
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const html = document.getElementsByTagName('html')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        html.classList.add('nav-open');
        this.sidebarVisible = true;
    };
    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };

    /******************************************* 
     * Validar donde se encuentra el usuario 
     *******************************************/
    isHome() {
        var titlee = this.location.prepareExternalUrl(this.location.path());
        return (titlee === '#/home');
    }
    
    /*********************************************************** 
     * Validar input de Buscar y llamar a Lista de Beneficios 
     ***********************************************************/
    searchValue(){
        if (!this.searchBenefit.valid) return false;
        let value = $('#searchBenefit').val().trim();
        if (!value) return false;
        $('#searchBenefit').val("");
        this.router.navigate(['/descuentos', 'search', value]);
    }

    /***************
    * Validar Login
    ****************/
    isLogin() {
        this.alias = "";
        let isLogged = this.storageService.isAuthenticated();
        if (isLogged) {
            this.alias = this.storageService.getCurrentUserAlias();
        }
        return isLogged;
    }

    logged(logged, alias) {
        this.isLogged = logged;
        this.alias = alias;
    }

    /***************
    * Logout 
    ****************/
    onLoggedout() {
        this.storageService.logout();
        this.isLogged = false;
        this.alias = null;
        // Actualiza Vistas dependiendo donde se encuentra
        var route = this.location.prepareExternalUrl(this.location.path());
        if (route === '#/home') {
            RubrosComponent.updateView.next(true);
        } else if (route.startsWith('#/descuento/')) {
            BenefitDetailComponent.updateView.next(true);
            BenefitThumbComponent.updateView.next(true);
        } else if (route.startsWith('#/descuentos')) {
            BenefitListComponent.updateView.next(true);
        } else {
            this.router.navigate(['/home']);
        }
    }

}
