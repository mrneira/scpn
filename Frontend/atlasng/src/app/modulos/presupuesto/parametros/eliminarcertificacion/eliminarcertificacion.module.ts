import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EliminarCertificacionRoutingModule } from './eliminarcertificacion.routing';
import { EliminarCertificacionComponent } from './componentes/eliminarcertificacion.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCertificacionModule } from '../../lov/certificacion/lov.certificacion.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';

@NgModule({
  imports: [SharedModule, EliminarCertificacionRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovCertificacionModule, LovPartidaGastoModule ],
  declarations: [EliminarCertificacionComponent]
})
export class EliminarCertificacionModule { }
