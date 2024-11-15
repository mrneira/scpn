import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCuentasporpagarRoutingModule } from './lov.cuentasporpagar.routing';

import { LovCuentasporpagarComponent } from './componentes/lov.cuentasporpagar.component';

@NgModule({
  imports: [SharedModule, LovCuentasporpagarRoutingModule],
  declarations: [LovCuentasporpagarComponent],
  exports: [LovCuentasporpagarComponent]
})
export class LovCuentasporpagarModule { }

