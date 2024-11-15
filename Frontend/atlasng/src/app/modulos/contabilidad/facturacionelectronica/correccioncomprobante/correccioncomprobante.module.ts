import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CorreccionComprobanteRoutingModule } from './correccioncomprobante.routing';

import {  CorreccionComprobanteComponent } from './componentes/correccioncomprobante.component';
import {FileUploadModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, CorreccionComprobanteRoutingModule,FileUploadModule ],
  declarations: [ CorreccionComprobanteComponent]
})
export class CorreccionComprobanteModule { }
