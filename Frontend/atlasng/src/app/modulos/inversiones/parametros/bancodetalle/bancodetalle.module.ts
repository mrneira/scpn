import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { BancodetalleRoutingModule } from './bancodetalle.routing';

import { BancodetalleComponent } from './componentes/bancodetalle.component';

@NgModule({
  imports: [SharedModule, BancodetalleRoutingModule],
  declarations: [BancodetalleComponent]
})
export class BancodetalleModule { }
