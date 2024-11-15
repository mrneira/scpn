import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConocimientoRoutingModule } from './conocimiento.routing';

import { ConocimientoComponent } from './componentes/conocimiento.component';


@NgModule({
  imports: [SharedModule, ConocimientoRoutingModule ],
  declarations: [ConocimientoComponent]
})
export class ConocimientoModule { }
