import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './detallePlantillasComprobante.routing';

import { DetallePlantillasComprobanteComponent } from './componentes/detallePlantillasComprobante.component';
import { LovPlantillasComprobanteModule } from '../../lov/plantillascomprobante/lov.plantillasComprobante.module';
import { LovCuentasContablesModule } from '../../lov/cuentascontables/lov.cuentasContables.module';
import { LovClasificadorModule } from '../../../presupuesto/lov/clasificador/lov.clasificador.module';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule, LovPlantillasComprobanteModule, LovCuentasContablesModule, LovClasificadorModule ],
  declarations: [DetallePlantillasComprobanteComponent]
})
export class DetallePlantillasComprobanteModule { }
  