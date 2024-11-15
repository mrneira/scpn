import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ComprobantesBatchRoutingModule } from './comprobantesBatch.routing';
import { ComprobantesBatchComponent } from './componentes/comprobantesBatch.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ComprobantesBatchRoutingModule, JasperModule],
  declarations: [ComprobantesBatchComponent]
})
export class ComprobantesBatchModule { }
