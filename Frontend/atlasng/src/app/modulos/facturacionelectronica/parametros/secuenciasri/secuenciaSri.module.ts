import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ModulosRoutingModule } from './secuenciaSri.routing';

import { SecuenciaSriComponent } from './componentes/secuenciaSri.component';


@NgModule({
  imports: [SharedModule, ModulosRoutingModule ],
  declarations: [SecuenciaSriComponent]
})
export class SecuenciaSriModule { }
