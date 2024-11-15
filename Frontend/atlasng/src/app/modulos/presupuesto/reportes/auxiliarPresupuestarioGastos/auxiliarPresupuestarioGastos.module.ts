import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AuxiliarPresupuestarioGastosRoutingModule } from './auxiliarPresupuestarioGastos.routing';
import { AuxiliarPresupuestarioGastosComponent } from './componentes/auxiliarPresupuestarioGastos.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPartidaGastoComponent } from '../../lov/partidagasto/componentes/lov.partidagasto.component';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';


@NgModule({
  imports: [SharedModule, AuxiliarPresupuestarioGastosRoutingModule, JasperModule, LovPartidaGastoModule ],
  declarations: [AuxiliarPresupuestarioGastosComponent]
})
export class AuxiliarPresupuestarioGastosModule { }
