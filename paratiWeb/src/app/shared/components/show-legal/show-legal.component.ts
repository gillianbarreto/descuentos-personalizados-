import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { ErrorServiceMessage } from '../../shared.data';

@Component({
  selector: 'app-show-legal',
  template: `
  <!-- Feedback -->
  <app-show-alert [messageAlert]="messageAlert" *ngIf="messageAlert" [classAlert]="classAlert" ></app-show-alert>

  <!-- Modal Términos y Condiciones -->
  <div class="modal fade" id="TerminosModal" tabindex="-1" role="dialog" aria-labelledby="TerminosModal" 
      aria-hidden="true">
      <div class="modal-dialog modal-lg" role="document">
          <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title">Términos y Condiciones</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body" [innerHTML]="terminos">
              </div>
              <div class="modal-footer">
                  <button type="button" class="btn btn-default" data-dismiss="modal">Cerrar</button>
              </div>
          </div>
      </div>
  </div>
  `,
  styles: [],
  providers: [AuthenticationService]
})
export class ShowLegalComponent implements OnInit {

  public terminos = "";
  public spinner = false;
  public messageAlert: string;
  public classAlert: string;

  constructor(private loginService: AuthenticationService, ) { }

  ngOnInit() {
    this.spinner = true;
    this.loginService.getTerms({}).subscribe(
      data => {
        this.spinner = false;
        this.terminos = data.data.termsAndConditions;
      },
      error => {
        this.spinner = false;
        console.log(error);
        this.showMessage("danger", ErrorServiceMessage);
      }
    );
  }

  // Feedback formContact
  showMessage(c, t) {
    this.messageAlert = t;
    this.classAlert = "alert-" + c;
    setTimeout(() => { this.messageAlert = ""; }, 5000);
  }

}
