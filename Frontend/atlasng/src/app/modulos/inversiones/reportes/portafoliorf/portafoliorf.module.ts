import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorfRoutingModule } from './portafoliorf.routing';

import { PortafoliorfComponent } from './componentes/portafoliorf.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorfRoutingModule, JasperModule ],
  declarations: [PortafoliorfComponent]
})
export class PortafoliorfModule { }
