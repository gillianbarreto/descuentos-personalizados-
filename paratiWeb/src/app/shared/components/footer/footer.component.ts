import { Component, OnInit } from '@angular/core';
import { VersionApp } from '../../shared.data'; 

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    test : Date = new Date();
    versionApp = VersionApp;

    constructor() { }

    ngOnInit() {}
}
