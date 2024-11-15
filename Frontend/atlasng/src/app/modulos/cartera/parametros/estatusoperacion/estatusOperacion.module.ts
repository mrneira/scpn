import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstatusOperacionRoutingModule } from './estatusOperacion.routing';

import { EstatusOperacionComponent } from './componentes/estatusOperacion.component';


@NgModule({
  imports: [SharedModule, EstatusOperacionRoutingModule ],
  declarations: [EstatusOperacionComponent]
})
export class EstatusOperacionModule { }
