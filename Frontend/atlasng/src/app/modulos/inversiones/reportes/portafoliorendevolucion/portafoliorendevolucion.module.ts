import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliordRoutingModule } from './portafoliorendevolucion.routing';

import { PortafoliorendevolucionComponent } from './componentes/portafoliorendevolucion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliordRoutingModule, JasperModule ],
  declarations: [PortafoliorendevolucionComponent]
})
export class PortafoliorendevolucionModule { }
