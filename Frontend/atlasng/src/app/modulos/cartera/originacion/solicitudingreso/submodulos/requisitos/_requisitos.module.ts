import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { RequisitosRoutingModule } from './_requisitos.routing';

import { RequisitosComponent } from './componentes/_requisitos.component';


@NgModule({
  imports: [SharedModule, RequisitosRoutingModule ],
  declarations: [RequisitosComponent],
  exports: [RequisitosComponent]
})
export class RequisitosModule { }
