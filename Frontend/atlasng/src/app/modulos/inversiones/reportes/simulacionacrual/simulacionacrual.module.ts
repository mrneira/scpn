import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SimulacionAcrualRoutingModule } from './simulacionacrual.routing';

import { SimulacionAcrualComponent } from './componentes/simulacionacrual.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [SharedModule, SimulacionAcrualRoutingModule, LovInversionesModule, JasperModule ],
  declarations: [SimulacionAcrualComponent]
})
export class SimulacionAcrualModule { }
