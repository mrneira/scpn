import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafolioTotalRoutingModule } from './portafoliototal.routing';

import { PortafolioTotalComponent } from './componentes/portafoliototal.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule,PortafolioTotalRoutingModule, JasperModule ],
  declarations: [PortafolioTotalComponent]
})
export class PortafolioTotalModule { }
