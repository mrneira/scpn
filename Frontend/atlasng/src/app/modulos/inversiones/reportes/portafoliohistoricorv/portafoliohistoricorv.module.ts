import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliohistoricorvRoutingModule } from './portafoliohistoricorv.routing';

import { PortafoliohistoricorvComponent } from './componentes/portafoliohistoricorv.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule,PortafoliohistoricorvRoutingModule, JasperModule ],
  declarations: [PortafoliohistoricorvComponent]
})
export class PortafoliohistoricorvModule { }
