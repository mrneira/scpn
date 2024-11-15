import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AccesoBancaEnLineaReporteRoutingModule } from './accesoBancaEnLineaReporte.routing';

import { AccesoBancaEnLineaReporteComponent } from './componentes/accesoBancaEnLineaReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovUsuariosModule} from '../../lov/usuarios/lov.usuarios.module';


@NgModule({
  imports: [SharedModule, AccesoBancaEnLineaReporteRoutingModule, JasperModule, LovUsuariosModule ],
  declarations: [AccesoBancaEnLineaReporteComponent]
})
export class AccesoBancaEnLineaReporteModule { }
