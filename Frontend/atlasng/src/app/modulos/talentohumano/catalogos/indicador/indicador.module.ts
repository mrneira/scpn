import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { IndicadorRoutingModule } from './indicador.routing';

import { IndicadorComponent } from './componentes/indicador.component';
import { LovActividadModule } from '../../lov/actividad/lov.actividad.module';

@NgModule({
  imports: [SharedModule, IndicadorRoutingModule ,LovActividadModule],
  declarations: [IndicadorComponent]
})
export class IndicadorModule { }
