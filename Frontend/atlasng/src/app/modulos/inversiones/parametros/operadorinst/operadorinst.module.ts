import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperadorinstRoutingModule } from './operadorinst.routing';

import { OperadorinstComponent } from './componentes/operadorinst.component';


@NgModule({
  imports: [SharedModule, OperadorinstRoutingModule ],
  declarations: [OperadorinstComponent]
})
export class OperadorinstModule { }
