import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorfsectorRoutingModule } from './portafoliorfsector.routing';

import { PortafoliorfsectorComponent } from './componentes/portafoliorfsector.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorfsectorRoutingModule, JasperModule ],
  declarations: [PortafoliorfsectorComponent]
})
export class PortafoliorfsectorModule { }
