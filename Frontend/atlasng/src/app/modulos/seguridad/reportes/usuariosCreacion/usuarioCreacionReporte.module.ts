import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UsuarioCreacionReporteRoutingModule } from './usuarioCreacionReporte.routing';

import { UsuarioCreacionReporteComponent } from './componentes/usuarioCreacionReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, UsuarioCreacionReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [UsuarioCreacionReporteComponent]
})
export class UsuarioCreacionReporteModule { }
