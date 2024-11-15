import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';
import { DetalleComponent } from './componentes/_detalle.component';
import { LovPartidaGastoModule } from '../../../../lov/partidagasto/lov.partidagasto.module';


@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovPartidaGastoModule ],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
