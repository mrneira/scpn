import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SeguroRubrosRoutingModule } from './seguroRubros.routing';

import { SeguroRubrosComponent } from './componentes/seguroRubros.component';

@NgModule({
  imports: [SharedModule, SeguroRubrosRoutingModule],
  declarations: [SeguroRubrosComponent]
})
export class SeguroRubrosModule { }
