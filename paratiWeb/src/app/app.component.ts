import { Component, OnInit, Inject, Renderer, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/platform-browser';
import { LocationStrategy, PlatformLocation, Location } from '@angular/common';
import { NavbarComponent } from './shared/components/navbar/navbar.component';

// Para identificar servidor o cliente en tiempo de ejecucion
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  template: `
    <app-navbar></app-navbar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
    <!-- Terminos y condiciones -->
    <app-show-legal></app-show-legal>
  `,
  styles: []
})
export class AppComponent implements OnInit {

  private _router: Subscription;
  private onBrowser;

  @ViewChild(NavbarComponent) navbar: NavbarComponent;

  constructor(private renderer: Renderer,
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: any,
    private element: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    public location: Location) {

    this.onBrowser = isPlatformBrowser(this.platformId);

    // Asignación de Título por Pagina
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        var title = "ParaTi App - " + this.getTitle(router.routerState, router.routerState.root).join('-');
        titleService.setTitle(title);
      }
    });

  }

  ngOnInit() {

    if (this.onBrowser) {
      // Ubicar pagina en Top al navegar
      var navbar: HTMLElement = this.element.nativeElement.children[0].children[0];
      this.router.events.subscribe(event => {
        if (event instanceof NavigationEnd) {
          window.scrollTo(0, 0);
          this.navbar.sidebarClose();
        }
      });

      // Efecto en Barra de Navegacion al hacer scroll
      this.renderer.listenGlobal('window', 'scroll', (event) => {
        const number = window.scrollY;
        if (number > 150 || window.pageYOffset > 150) {
          navbar.classList.remove('navbar-transparent');
        } else {
          navbar.classList.add('navbar-transparent');
        }
      });
    }

  }

  // Obtener Título de la Página
  getTitle(state, parent) {
    var data = [];
    if (parent && parent.snapshot.data && parent.snapshot.data.title) {
      data.push(parent.snapshot.data.title);
    }

    if (state && parent) {
      data.push(this.getTitle(state, state.firstChild(parent)));
    }
    return data;
  }
}
