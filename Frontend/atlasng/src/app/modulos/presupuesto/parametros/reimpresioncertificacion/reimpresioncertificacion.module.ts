import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ReimpresioncertificacionRoutingModule } from './reimpresioncertificacion.routing';
import { ReimpresioncertificacionComponent } from './componentes/reimpresioncertificacion.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCertificacionModule } from '../../lov/certificacion/lov.certificacion.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';

@NgModule({
  imports: [SharedModule, ReimpresioncertificacionRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovCertificacionModule, LovPartidaGastoModule ],
  declarations: [ReimpresioncertificacionComponent]
})
export class ReimpresioncertificacionModule { }
