import { Component, OnInit } from '@angular/core';
import { RubrosComponent } from '../shared/components/rubros/rubros.component';

import { BenefitsService } from '../shared/services/benefits.service';
import { StorageService } from '../shared/services/storage.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [
        BenefitsService,
        StorageService
    ]
})

export class HomeComponent implements OnInit {

    public totalBenefits = 0;
    public totalSources = 0;
    public totalLocals = 0;
    public isLogged;
    public showVideo = false;

    constructor( private benefitsService: BenefitsService,
                 public  router: Router, 
                 private storageService: StorageService ) { }

    ngOnInit() {
        this.isLogged = this.storageService.isAuthenticated();
        this.getTotals();
        // console.log("¡Updated!");
    }

    /*************
    * Counters
    **************/
    getTotals() {
        this.totalBenefits = 0;
        let param = {}; 
        this.benefitsService.getBenefitsTotal(param).subscribe(
            data => {                
                if (data.data) {
                    this.totalBenefits = data.data.benefits;
                    if (data.data.featured) 
                        this.totalBenefits = this.totalBenefits + data.data.featured;
                    this.totalSources = data.data.sources;
                    this.totalLocals = data.data.establishments;
                }             
            },
            error => {
                console.log(error);
            }
        );
    }

    /*******************
    * Ir a registrarse 
    ********************/
    signUp() {
        this.router.navigate(['/signup']);
    }
}
