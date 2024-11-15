import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { HorasextrasRoutingModule } from './horasextras.routing';

import { HorasExtrasComponent } from './componentes/horasextras.component';

@NgModule({
  imports: [SharedModule, HorasextrasRoutingModule],
  declarations: [HorasExtrasComponent],
  exports: [HorasExtrasComponent]
})
export class HorasExtrasModule { }
