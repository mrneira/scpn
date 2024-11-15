import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovActividadEconomicaRoutingModule } from './lov.actividadEconomica.routing';

import { LovActividadEconomicaComponent } from './componentes/lov.actividadEconomica.component';

@NgModule({
  imports: [SharedModule, LovActividadEconomicaRoutingModule],
  declarations: [LovActividadEconomicaComponent],
  exports: [LovActividadEconomicaComponent],
})
export class LovActividadEconomicaModule { }

