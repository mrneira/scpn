import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCausalesVinculacionRoutingModule } from './lov.causalesVinculacion.routing';

import { LovCausalesVinculacionComponent } from './componentes/lov.causalesVinculacion.component';

@NgModule({
  imports: [SharedModule, LovCausalesVinculacionRoutingModule],
  declarations: [LovCausalesVinculacionComponent],
  exports: [LovCausalesVinculacionComponent],
})
export class LovCausalesVinculacionModule { }

