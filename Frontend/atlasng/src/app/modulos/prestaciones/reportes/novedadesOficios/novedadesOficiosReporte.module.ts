import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { NovedadesOficiosReporteRoutingModule } from './novedadesOficiosReporte.routing';

import { NovedadesOficiosReporteComponent } from './componentes/novedadesOficiosReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, NovedadesOficiosReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [NovedadesOficiosReporteComponent]
})
export class NovedadesOficiosReporteModule { }
