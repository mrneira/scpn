import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { FacturasParqueaderosRoutingModule } from './facturasParqueaderos.routing';

import { FacturasParqueaderosComponent } from './componentes/facturasParqueaderos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, FacturasParqueaderosRoutingModule, JasperModule],
  declarations: [FacturasParqueaderosComponent]
})
export class FacturasParqueaderosModule { }
