import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CompromisoRoutingModule } from './compromiso.routing';
import { CompromisoComponent } from './componentes/compromiso.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCompromisoModule } from '../../lov/compromiso/lov.compromiso.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';

@NgModule({
  imports: [SharedModule, CompromisoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovCompromisoModule, LovPartidaGastoModule ],
  declarations: [CompromisoComponent]
})
export class CompromisoModule { }
