import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RegularizacionPresupuestariaRoutingModule } from '../regularizacionpresupuestaria/regularizacionpresupuestaria.routing';

import { RegularizacionPresupuestariaComponent } from './componentes/regularizacionpresupuestaria.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovComprobantesModule } from '../../../contabilidad/lov/comprobante/lov.comprobantes.module';

@NgModule({
  imports: [SharedModule, RegularizacionPresupuestariaRoutingModule, ComprobanteModule, DetalleModule, JasperModule, 
  LovComprobantesModule ],
  declarations: [RegularizacionPresupuestariaComponent]
})
export class RegularizacionPresupuestariaModule { }
