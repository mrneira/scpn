import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnulacioncxpRoutingModule } from './anulacioncxp.routing';

import { AnulacioncxpComponent } from './componentes/anulacioncxp.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { LovCuentasporpagarModule } from '../../lov/cuentasporpagar/lov.cuentasporpagar.module';
import { DetallePlantillasComprobanteModule } from '../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, AnulacioncxpRoutingModule, ComprobanteModule, DetalleModule, LovProveedoresModule,
    LovPlantillasComprobanteModule, DetallePlantillasComprobanteModule, LovCuentasporpagarModule, JasperModule],
  declarations: [AnulacioncxpComponent]
})
export class AnulacioncxpModule { }
