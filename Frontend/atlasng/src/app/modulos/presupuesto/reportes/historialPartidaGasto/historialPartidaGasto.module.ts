import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistorialPartidaGastoRoutingModule } from './historialPartidaGasto.routing';
import { HistorialPartidaGastoComponent } from './componentes/historialPartidaGasto.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovPartidaGastoComponent } from '../../lov/partidagasto/componentes/lov.partidagasto.component';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';


@NgModule({
  imports: [SharedModule, HistorialPartidaGastoRoutingModule, JasperModule, LovPartidaGastoModule ],
  declarations: [HistorialPartidaGastoComponent]
})
export class HistorialPartidaGastoModule { }
