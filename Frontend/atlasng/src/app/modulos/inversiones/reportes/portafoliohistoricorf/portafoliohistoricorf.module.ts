import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliohistoricorfRoutingModule } from './portafoliohistoricorf.routing';

import { PortafoliohistoricorfComponent } from './componentes/portafoliohistoricorf.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule,PortafoliohistoricorfRoutingModule, JasperModule ],
  declarations: [PortafoliohistoricorfComponent]
})
export class PortafoliohistoricorfModule { }
