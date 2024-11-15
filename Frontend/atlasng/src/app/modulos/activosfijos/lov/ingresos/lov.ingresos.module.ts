import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovIngresosRoutingModule } from './lov.ingresos.routing';

import { LovIngresosComponent } from './componentes/lov.ingresos.component';


@NgModule({
  imports: [SharedModule, LovIngresosRoutingModule],
  declarations: [LovIngresosComponent],
  exports: [LovIngresosComponent]
})
export class LovIngresosModule { }

