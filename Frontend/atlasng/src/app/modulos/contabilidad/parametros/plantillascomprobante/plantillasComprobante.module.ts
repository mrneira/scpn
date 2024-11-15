import { routing } from '../../../../util/router/app.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './plantillasComprobante.routing';

import { PlantillasComprobanteComponent } from './componentes/plantillasComprobante.component';
import { LovConceptoContablesModule } from '../../lov/conceptocontables/lov.conceptoContables.module';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';

@NgModule({
  imports: [SharedModule, ModulosRoutingModule, LovConceptoContablesModule, LovTransaccionesModule ],
  declarations: [PlantillasComprobanteComponent]
})
export class PlantillasComprobanteModule { }
