import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { GarantiasParqueaderoRoutingModule } from './garantiasparqueadero.routing';

import { GarantiasParqueaderoComponent } from './componentes/garantiasparqueadero.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovClientesModule } from '../../lov/clientes/lov.clientes.module';


@NgModule({
  imports: [SharedModule, GarantiasParqueaderoRoutingModule, JasperModule, LovClientesModule ],
  declarations: [GarantiasParqueaderoComponent]
})
export class GarantiasParqueaderoModule { }
