import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AporteConsolidadoRoutingModule } from './aporteconsolidado.routing';

import { AporteConsolidadoComponent } from './componentes/aporteconsolidado.component';
import { LovPersonasModule } from './../../personas/lov/personas/lov.personas.module';
import { LovAportesModule } from './../lov/aportes/lov.aportes.module'
import { JasperModule } from '../../../util/componentes/jasper/jasper.module';
import { TreeTableModule} from 'primeng/primeng';
import { SelectButtonModule} from 'primeng/primeng';
@NgModule({
  imports: [SharedModule, AporteConsolidadoRoutingModule, LovAportesModule,LovPersonasModule, JasperModule,SelectButtonModule ,TreeTableModule],
  declarations: [AporteConsolidadoComponent]
})
export class AporteConsolidadoModule { }
