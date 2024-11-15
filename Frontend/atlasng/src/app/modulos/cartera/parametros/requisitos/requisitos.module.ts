import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { RequisitosRoutingModule } from './requisitos.routing';

import { RequisitosComponent } from './componentes/requisitos.component';


@NgModule({
  imports: [SharedModule, RequisitosRoutingModule ],
  declarations: [RequisitosComponent]
})
export class RequisitosModule { }
