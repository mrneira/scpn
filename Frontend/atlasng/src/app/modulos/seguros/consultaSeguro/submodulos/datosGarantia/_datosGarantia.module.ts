import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DatosGarantiaRoutingModule } from './_datosGarantia.routing';
import { DatosGarantiaComponent } from './componentes/_datosGarantia.component';
import { DatosGarantiaAvaluoComponent } from './componentes/_datosGarantiaAvaluo.component';

@NgModule({
  imports: [SharedModule, DatosGarantiaRoutingModule],
  declarations: [DatosGarantiaComponent, DatosGarantiaAvaluoComponent],
  exports: [DatosGarantiaComponent, DatosGarantiaAvaluoComponent]
})
export class DatosGarantiaModule { }
