import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PrestacionesnReclamadasReporteRoutingModule } from './prestacionesnReclamadasReporte.routing';

import { PrestacionesnReclamadasReporteComponent } from './componentes/prestacionesnReclamadasReporte.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import {LovPersonasModule} from '../../../personas/lov/personas/lov.personas.module'


@NgModule({
  imports: [SharedModule, PrestacionesnReclamadasReporteRoutingModule, JasperModule, LovPersonasModule ],
  declarations: [PrestacionesnReclamadasReporteComponent]
})
export class PrestacionesnReclamadasReporteModule { }
