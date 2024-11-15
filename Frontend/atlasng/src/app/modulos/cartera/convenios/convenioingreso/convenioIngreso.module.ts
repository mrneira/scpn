import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConvenioIngresoRoutingModule } from './convenioIngreso.routing';

import { ConvenioIngresoComponent } from './componentes/convenioIngreso.component';

@NgModule({
  imports: [SharedModule, ConvenioIngresoRoutingModule],
  declarations: [ConvenioIngresoComponent]
})
export class ConvenioIngresoModule { }
