import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';
// import { LovConceptoContablesModule } from '../../../../lov/conceptocontables/lov.conceptoContables.module';
// import { LovPlantillasComprobanteModule } from '../../../../lov/plantillascomprobante/lov.plantillasComprobante.module';
// import { LovCuentasContablesModule } from '../../../../lov/cuentascontables/lov.cuentasContables.module';
// import { DetallePlantillasComprobanteModule } from '../../../../parametros/detalleplantillascomprobante/detallePlantillasComprobante.module';
import { LovProductosModule } from '../../../../lov/productos/lov.productos.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovProductosModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
