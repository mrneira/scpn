import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorvEmisorRoutingModule } from './portafoliorvemisor.routing';

import { PortafoliorvEmisorComponent } from './componentes/portafoliorvemisor.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorvEmisorRoutingModule, JasperModule ],
  declarations: [PortafoliorvEmisorComponent]
})
export class PortafoliorvemisorModule { }
