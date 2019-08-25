import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-show-alert',
  templateUrl: './show-alert.component.html',
  styleUrls: ['./show-alert.component.scss']
})
export class ShowAlertComponent implements OnInit {

  @Input() messageAlert: string;
  @Input() classAlert: string;

  public showAlert: boolean;

  constructor() { }

  ngOnInit() {
    setTimeout(() => { this.messageAlert = ""; }, 5000);
  }

}
