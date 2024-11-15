import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorfemisorRoutingModule } from './portafoliorfemisor.routing';

import { PortafoliorfemisorComponent } from './componentes/portafoliorfemisor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorfemisorRoutingModule, JasperModule ],
  declarations: [PortafoliorfemisorComponent]
})
export class PortafoliorfemisorModule { }
