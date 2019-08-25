import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-navigate-back',
  templateUrl: './navigate-back.component.html',
  styleUrls: ['./navigate-back.component.scss']
})
export class NavigateBackComponent {

  constructor(private _location: Location) { }

  backClicked() {
    this._location.back();
  }

}
