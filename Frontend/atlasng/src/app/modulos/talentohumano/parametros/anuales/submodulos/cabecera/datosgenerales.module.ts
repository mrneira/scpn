import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DatosGeneralesRoutingModule } from './datosgenerales.routing';

import { DatosGeneralesComponent } from './componentes/datosgenerales.component';

import{LovEstablecimientoModule} from '../../../../lov/establecimiento/lov.establecimiento.module';


@NgModule({
  imports: [SharedModule, DatosGeneralesRoutingModule, LovEstablecimientoModule],
  declarations: [DatosGeneralesComponent],
  exports: [DatosGeneralesComponent]
})
export class DatosGeneralesModule { }
