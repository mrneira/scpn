import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CertificacionoRoutingModule } from './certificacion.routing';
import { CertificacionComponent } from './componentes/certificacion.component';
import { CabeceraModule } from './submodulos/cabecera/cabecera.module';
import { DetalleModule } from './submodulos/detalle/detalle.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCertificacionModule } from '../../lov/certificacion/lov.certificacion.module';
import { LovPartidaGastoModule } from '../../lov/partidagasto/lov.partidagasto.module';

@NgModule({
  imports: [SharedModule, CertificacionoRoutingModule, CabeceraModule, DetalleModule, JasperModule, LovCertificacionModule, LovPartidaGastoModule ],
  declarations: [CertificacionComponent]
})
export class CertificacionModule { }
