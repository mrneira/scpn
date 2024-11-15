import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { ExpedienteRoutingModule } from './expediente.routing';

import { ExpedienteComponent } from './componentes/expediente.component';

@NgModule({
  imports: [SharedModule, ExpedienteRoutingModule ],
  declarations: [ExpedienteComponent],
  exports: [ExpedienteComponent]
})
export class ExpedienteModule { }
