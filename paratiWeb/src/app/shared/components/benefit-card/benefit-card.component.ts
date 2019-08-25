import { Component, OnInit, Input } from '@angular/core';
import { cardBenefit } from '../../models/setting-benefits';
import { Router } from '@angular/router';

@Component({
  selector: 'app-benefit-card',
  templateUrl: './benefit-card.component.html',
  styleUrls: ['./benefit-card.component.scss']
})
export class BenefitCardComponent implements OnInit {

  @Input() card: cardBenefit;

  constructor( private router: Router ) { }

  ngOnInit() {
  }

  showDetail() {
    this.router.navigate(['/descuento', this.card.idBenefit]);
  }

}
