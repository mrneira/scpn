import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPlantillasComprobanteRoutingModule } from './lov.plantillasComprobante.routing';

import { LovPlantillasComprobanteComponent } from './componentes/lov.plantillasComprobante.component';


@NgModule({
  imports: [SharedModule, LovPlantillasComprobanteRoutingModule],
  declarations: [LovPlantillasComprobanteComponent],
  exports: [LovPlantillasComprobanteComponent]
})
export class LovPlantillasComprobanteModule { }

