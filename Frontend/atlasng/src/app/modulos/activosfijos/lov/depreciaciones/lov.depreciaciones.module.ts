import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDepreciacionesRoutingModule } from './lov.depreciaciones.routing';

import { LovDepreciacionesComponent } from './componentes/lov.depreciaciones.component';


@NgModule({
  imports: [SharedModule, LovDepreciacionesRoutingModule],
  declarations: [LovDepreciacionesComponent],
  exports: [LovDepreciacionesComponent]
})
export class LovDepreciacionesModule { }

