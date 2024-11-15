import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UsuarioReporteRoutingModule } from './usuarioReporte.routing';

import { UsuarioReporteComponent } from './componentes/usuarioReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, UsuarioReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [UsuarioReporteComponent]
})
export class UsuarioReporteModule { }
