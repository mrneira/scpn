import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import {DevolucionesDescuentosReporteRoutingModule } from './devolucionesDescuentos.routing';

import { DevolucionesDescuentosReporteComponent } from './componentes/devolucionesDescuentosReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'
import { LovUsuariosModule } from '../../../seguridad/lov/usuarios/lov.usuarios.module';

@NgModule({
  imports: [SharedModule, DevolucionesDescuentosReporteRoutingModule, JasperModule, LovPersonasModule,LovUsuariosModule ],
  declarations: [DevolucionesDescuentosReporteComponent]
})
export class DevolucionesDescuentosReporteModule { }
