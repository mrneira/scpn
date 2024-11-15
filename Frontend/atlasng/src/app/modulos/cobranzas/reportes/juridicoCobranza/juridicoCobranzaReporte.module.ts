import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { JuridicoCobranzaReporteRoutingModule } from './juridicoCobranzaReporte.routing';

import { JuridicoCobranzaReporteComponent } from './componentes/juridicoCobranzaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, JuridicoCobranzaReporteRoutingModule, JasperModule, LovPersonasModule,LovUsuariosModule ],
  declarations: [JuridicoCobranzaReporteComponent]
})
export class JuridicoCobranzaReporteModule { }
