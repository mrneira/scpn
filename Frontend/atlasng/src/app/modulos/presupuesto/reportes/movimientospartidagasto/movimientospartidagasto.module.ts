import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MovimientosPartidaGastoRoutingModule } from './movimientospartidagasto.routing';
import { MovimientosPartidaGastoComponent } from './componentes/movimientospartidagasto.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovPartidaGastoModule } from "../../lov/partidagasto/lov.partidagasto.module";
import { TooltipModule} from 'primeng/primeng'
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [
    SharedModule, 
    MovimientosPartidaGastoRoutingModule, 
    LovPersonasModule, 
    LovPartidaGastoModule,TooltipModule,JasperModule ],
  declarations: [MovimientosPartidaGastoComponent],
  exports: [MovimientosPartidaGastoComponent]
})
export class MovimientosPartidaGastoModule { }
