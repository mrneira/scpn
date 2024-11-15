import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AnularCompromisoRoutingModule } from './anularcompromiso.routing';
import { AnularCompromisoComponent } from './componentes/anularcompromiso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCompromisoModule } from '../../lov/compromiso/lov.compromiso.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';

@NgModule({
  imports: [SharedModule, AnularCompromisoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovCompromisoModule, LovPartidaGastoModule ],
  declarations: [AnularCompromisoComponent]
})
export class AnularCompromisoModule { }
