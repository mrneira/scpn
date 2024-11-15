import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AlertRoutingModule } from './alert.routing';

import { AlertComponent } from './componentes/alert.component';
import {GrowlModule} from 'primeng/primeng';


@NgModule({
  imports: [SharedModule, AlertRoutingModule, GrowlModule],
  declarations: [AlertComponent],
  exports: [AlertComponent],

})
export class AlertModule { }

