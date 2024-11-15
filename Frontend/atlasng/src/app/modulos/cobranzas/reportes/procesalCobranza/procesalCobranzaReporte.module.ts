import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ProcesalCobranzaReporteRoutingModule } from './procesalCobranzaReporte.routing';

import { ProcesalCobranzaReporteComponent } from './componentes/procesalCobranzaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, ProcesalCobranzaReporteRoutingModule, JasperModule, LovPersonasModule,LovUsuariosModule ],
  declarations: [ProcesalCobranzaReporteComponent]
})
export class ProcesalCobranzaReporteModule { }
