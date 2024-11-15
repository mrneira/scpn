import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UsuarioIngresoReporteRoutingModule } from './usuarioIngresoReporte.routing';

import { UsuarioIngresoReporteComponent } from './componentes/usuarioIngresoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, UsuarioIngresoReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [UsuarioIngresoReporteComponent]
})
export class UsuarioIngresoReporteModule { }
