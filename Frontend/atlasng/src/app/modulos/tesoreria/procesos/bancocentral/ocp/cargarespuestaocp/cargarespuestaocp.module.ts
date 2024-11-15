import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CargaRespuestaOcpRoutingModule } from './cargarespuestaocp.routing';

import { CargaRespuestaOcpComponent } from './componentes/cargarespuestaocp.component';


@NgModule({
  imports: [SharedModule,CargaRespuestaOcpRoutingModule ],
  declarations: [CargaRespuestaOcpComponent]
})
export class CargaRespuestaOcpModule { }
