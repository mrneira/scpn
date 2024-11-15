import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IngresocxpRoutingModule } from './ingresocxp.routing';

import { IngresocxpComponent } from './componentes/ingresocxp.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
import { LovCuentasporpagarModule } from '../../lov/cuentasporpagar/lov.cuentasporpagar.module';
import { DetallePlantillasComprobanteModule } from '../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { LovIngresosModule } from '../../../activosfijos/lov/ingresos/lov.ingresos.module';
import { InputSwitchModule } from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, IngresocxpRoutingModule, ComprobanteModule, DetalleModule, LovProveedoresModule, LovCuentasContablesModule, LovIngresosModule,
    LovPlantillasComprobanteModule, DetallePlantillasComprobanteModule, LovCuentasporpagarModule, JasperModule, InputSwitchModule],
  declarations: [IngresocxpComponent]
})
export class IngresocxpModule { }
