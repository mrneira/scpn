import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovClientesRoutingModule } from './lov.clientes.routing';

import { LovClientesComponent } from './componentes/lov.clientes.component';

@NgModule({
  imports: [SharedModule, LovClientesRoutingModule],
  declarations: [LovClientesComponent],
  exports: [LovClientesComponent],
})
export class LovClientesModule { }