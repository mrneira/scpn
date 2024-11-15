import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEgresosRoutingModule } from './lov.egresos.routing';

import { LovEgresosComponent } from './componentes/lov.egresos.component';


@NgModule({
  imports: [SharedModule, LovEgresosRoutingModule],
  declarations: [LovEgresosComponent],
  exports: [LovEgresosComponent]
})
export class LovEgresosModule { }

