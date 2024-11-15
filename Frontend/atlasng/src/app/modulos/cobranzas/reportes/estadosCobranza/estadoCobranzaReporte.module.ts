import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { EstadoCobranzaReporteRoutingModule } from './estadoCobranzaReporte.routing';

import { EstadoCobranzaReporteComponent } from './componentes/estadoCobranzaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, EstadoCobranzaReporteRoutingModule, JasperModule, LovPersonasModule,LovUsuariosModule ],
  declarations: [EstadoCobranzaReporteComponent]
})
export class EstadoCobranzaReporteModule { }
