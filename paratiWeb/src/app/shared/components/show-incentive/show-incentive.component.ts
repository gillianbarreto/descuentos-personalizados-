import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { DownloadappComponent } from '../downloadapp/downloadapp.component';
import { Router } from '@angular/router';

declare var $ :any;

@Component({
  selector: 'app-show-incentive',
  templateUrl: './show-incentive.component.html',
  styleUrls: ['./show-incentive.component.scss']
})
export class ShowIncentiveComponent implements OnInit {

  constructor( public  router: Router) { }

  // Aviso de descarga 
  @HostListener('window:scroll', ['$event'])
  checkScroll() {
    const scrollPosition = window.pageYOffset
    if (scrollPosition > 20) {
      $('#aviso').show();
    } else {
      $('#aviso').hide(0);
    }
  }

  ngOnInit() {
     // Oculta aviso de descarga
     $('#aviso').hide(0);
  }

  /*********************
   * Ir a registrarse 
   ********************/
  signUp() {
    this.router.navigate(['/signup']);
  }

}
