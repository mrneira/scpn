import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCantonesRoutingModule } from './lov.cantones.routing';

import { LovCantonesComponent } from './componentes/lov.cantones.component';

@NgModule({
  imports: [SharedModule, LovCantonesRoutingModule],
  declarations: [LovCantonesComponent],
  exports: [LovCantonesComponent],
})
export class LovCantonesModule { }
