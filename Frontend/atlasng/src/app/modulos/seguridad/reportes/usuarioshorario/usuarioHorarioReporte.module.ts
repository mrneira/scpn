import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UsuarioHorarioReporteRoutingModule } from './usuarioHorarioReporte.routing';

import { UsuarioHorarioReporteComponent } from './componentes/usuarioHorarioReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, UsuarioHorarioReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [UsuarioHorarioReporteComponent]
})
export class UsuarioHorarioReporteModule { }
