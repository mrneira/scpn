import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LiquidacionViaticosRoutingModule } from './liquidacionviaticos.routing';

import { LiquidacionViaticosComponent } from './componentes/liquidacionviaticos.component';
import { ComprobanteModule } from './submodulos/comprobante/comprobante.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
//import { LovProveedoresModule } from '../../lov/proveedores/lov.proveedores.module';
//import { LovCuentasporpagarModule } from '../../lov/cuentasporpagar/lov.cuentasporpagar.module';
//import { DetallePlantillasComprobanteModule } from '../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
//import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
//import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
//import { LovIngresosModule } from '../../../activosfijos/lov/ingresos/lov.ingresos.module';
import { InputSwitchModule } from 'primeng/primeng';
import { LovLiquidacionesModule } from '../../lov/liquidaciones/lov.liquidaciones.module';
import { LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module';

@NgModule({
  imports: [SharedModule, LiquidacionViaticosRoutingModule, ComprobanteModule, DetalleModule, LovLiquidacionesModule
    ,JasperModule, InputSwitchModule, LovPersonasModule ],
  declarations: [LiquidacionViaticosComponent]
})
export class LiquidacionViaticosModule { }
