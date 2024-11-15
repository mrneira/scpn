import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { TablaAccionesJudicialesRoutingRouting } from './_tablaAccionesJudiciales.routing';
import { TablaAccionesJudicialesComponent } from './componentes/_tablaAccionesJudiciales.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, TablaAccionesJudicialesRoutingRouting, JasperModule ],
  declarations: [TablaAccionesJudicialesComponent],
  exports: [TablaAccionesJudicialesComponent]
})
export class TablaAccionesJudicialesModule { }
