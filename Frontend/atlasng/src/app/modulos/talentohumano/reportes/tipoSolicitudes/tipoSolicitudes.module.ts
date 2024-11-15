import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TipoSolicitudesRoutingModule } from './tipoSolicitudes.routing';
import { TipoSolicitudesComponent } from './componentes/tipoSolicitudes.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, TipoSolicitudesRoutingModule, JasperModule],
  declarations: [TipoSolicitudesComponent]
})
export class TipoSolicitudesModule { }
