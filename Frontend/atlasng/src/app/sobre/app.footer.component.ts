import {Component,Inject,forwardRef} from '@angular/core';
import {AppComponent} from '../app.component';

@Component({
    selector: 'app-footer',
    template: `
        <div class="card">
            <div class="footer">
                    <span class="footer-text-left">Atlas</span>
                    <span class="footer-text-right"><span class="ui-icon ui-icon-copyright"></span>  <span>Asistecooper</span></span>
            </div>
        </div>
    `
})
export class AppFooter {

}
