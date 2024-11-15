import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PortafoliorvRoutingModule } from './plananualdetalle.routing';

import { PlananualdetalleComponent } from './componentes/plananualdetalle.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, PortafoliorvRoutingModule, JasperModule ],
  declarations: [PlananualdetalleComponent]
})
export class PlananualdetalleModule { }
