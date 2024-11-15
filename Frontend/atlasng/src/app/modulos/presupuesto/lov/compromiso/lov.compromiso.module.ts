import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCompromisoRoutingModule } from './lov.compromiso.routing';

import { LovCompromisoComponent } from './componentes/lov.compromiso.component';


@NgModule({
  imports: [SharedModule, LovCompromisoRoutingModule],
  declarations: [LovCompromisoComponent],
  exports: [LovCompromisoComponent]
})
export class LovCompromisoModule { }

