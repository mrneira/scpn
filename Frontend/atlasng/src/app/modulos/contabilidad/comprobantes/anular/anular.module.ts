import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnularRoutingModule } from './anular.routing';

import { AnularComponent } from './componentes/anular.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovConceptoContablesModule } from '../../lov/conceptocontables/lov.conceptoContables.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { LovPartidaPresupuestariaModule } from '../../lov/partidapresupuestaria/lov.partidapresupuestaria.module';
import { DetallePlantillasComprobanteModule } from '../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
import { LovComprobantesModule } from '../../lov/comprobante/lov.comprobantes.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovSociosModule } from '../../../socios/lov/socios/lov.socios.module';

@NgModule({
  imports: [SharedModule, AnularRoutingModule, ComprobanteModule, DetalleModule, LovPlantillasComprobanteModule, LovConceptoContablesModule
  , LovCuentasContablesModule, DetallePlantillasComprobanteModule, LovPartidaPresupuestariaModule, LovComprobantesModule,JasperModule, LovSociosModule ],
  declarations: [AnularComponent]
})
export class AnularModule { }
