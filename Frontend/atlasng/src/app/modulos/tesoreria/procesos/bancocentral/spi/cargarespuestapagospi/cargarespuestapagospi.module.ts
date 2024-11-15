import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CargaRespuestaPagoSpiRoutingModule } from './cargarespuestapagospi.routing';

import { CargaRespuestaPagoSpiComponent } from './componentes/cargarespuestapagospi.component';


@NgModule({
  imports: [SharedModule,CargaRespuestaPagoSpiRoutingModule ],
  declarations: [CargaRespuestaPagoSpiComponent]
})
export class CargaRespuestaPagoSpiModule { }
