import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EmpresaBceRoutingModule } from './empresabce.routing';

import { EmpresaBceComponent } from './componentes/empresabce.component';


@NgModule({
  imports: [SharedModule, EmpresaBceRoutingModule ],
  declarations: [EmpresaBceComponent]
})
export class EmpresaBceModule { }
