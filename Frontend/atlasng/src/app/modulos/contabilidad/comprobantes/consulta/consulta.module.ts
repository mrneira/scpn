import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaRoutingModule } from './consulta.routing';

import { ConsultaComponent } from './componentes/consulta.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { LovComprobantesModule } from '../../lov/comprobante/lov.comprobantes.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaRoutingModule, ComprobanteModule, DetalleModule, 
  LovComprobantesModule,JasperModule ],
  declarations: [ConsultaComponent]
})
export class ConsultaModule { }
