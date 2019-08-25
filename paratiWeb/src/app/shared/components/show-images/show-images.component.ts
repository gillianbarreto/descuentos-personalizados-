import { Component, OnInit, Input, ViewChild, Renderer2, ElementRef  } from '@angular/core';

@Component({
    selector: 'show-images',
    templateUrl: './show-images.component.html',
    styleUrls: ['./show-images.component.scss']
})
export class ShowImagesComponent implements OnInit {

    @ViewChild("thumb") thumb: ElementRef;

    @Input() src: string;
    @Input() classImage: string;
    @Input() altImage: string;
    @Input() sizeImage: string;

    constructor( private renderer: Renderer2 ) { }

    ngOnInit() {
        this.renderer.setAttribute(this.thumb.nativeElement, "src", this.src ); 
    }

}
