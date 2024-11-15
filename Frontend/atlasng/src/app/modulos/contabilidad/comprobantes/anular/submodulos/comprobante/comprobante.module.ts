import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ComprobanteRoutingModule } from './comprobante.routing';

import { ComprobanteComponent } from './componentes/_comprobante.component';



@NgModule({
  imports: [SharedModule, ComprobanteRoutingModule ],
  declarations: [ComprobanteComponent],
  exports: [ComprobanteComponent]
})
export class ComprobanteModule { }
