import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AccionesCobranzaReporteRoutingModule } from './accionesCobranzaReporte.routing';

import { AccionesCobranzaReporteComponent } from './componentes/accionesCobranzaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, AccionesCobranzaReporteRoutingModule, JasperModule, LovPersonasModule,LovUsuariosModule ],
  declarations: [AccionesCobranzaReporteComponent]
})
export class AccionesCobranzaReporteModule { }
