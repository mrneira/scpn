import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorvRoutingModule } from './portafoliorv.routing';

import { PortafoliorvComponent } from './componentes/portafoliorv.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorvRoutingModule, JasperModule ],
  declarations: [PortafoliorvComponent]
})
export class PortafoliorvModule { }
