import { Component, OnInit, Input } from '@angular/core';
import { sectionBenefit, cardBenefit } from '../../models/setting-benefits';

@Component({
  selector: 'app-section-carrousel',
  templateUrl: './section-carrousel.component.html',
  styleUrls: ['./section-carrousel.component.scss']
})
export class SectionCarrouselComponent implements OnInit {

  @Input() section: sectionBenefit;

  slide: any[];
 
  constructor() { }

  ngOnInit() {
    this.createSlider();
  }

  public createSlider() {
    let card: cardBenefit[] = [];
    let benefits: cardBenefit[] = this.section.benefit;
    this.slide=[];
    let c = benefits.length;
    if (c > 9) c = 9;  // muestra los primeros 9
    let j = 0;
    // agrupa de 3 en 3
    for (let i = 0; i < c; i++) {
      benefits[i].carousel = true;
      card.push(benefits[i]);
      j++;
      if (j == 3) {
        this.slide.push(card);
        card = [];
        j = 0;
      }
    }
    if (card.length > 0) {
      this.slide.push(card);
    }
  }
}
