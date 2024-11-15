import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovPartidaPresupuestariaRoutingModule } from './lov.partidapresupuestaria.routing';

import { LovPartidaPresupuestariaComponent } from './componentes/lov.partidapresupuestaria.component';


@NgModule({
  imports: [SharedModule, LovPartidaPresupuestariaRoutingModule],
  declarations: [LovPartidaPresupuestariaComponent],
  exports: [LovPartidaPresupuestariaComponent]
})
export class LovPartidaPresupuestariaModule { }

