import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { UsuariosAccesoReporteRoutingModule } from './usuariosAccesoReporte.routing';

import { UsuariosAccesoReporteComponent } from './componentes/usuariosAccesoReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, UsuariosAccesoReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [UsuariosAccesoReporteComponent]
})
export class UsuariosAccesoReporteModule { }
