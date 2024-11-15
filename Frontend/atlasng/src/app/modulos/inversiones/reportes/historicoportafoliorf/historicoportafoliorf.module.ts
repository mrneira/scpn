import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HistoricoportafoliorfRoutingModule } from './historicoportafoliorf.routing';

import { HistoricoportafoliorfComponent } from './componentes/historicoportafoliorf.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule,HistoricoportafoliorfRoutingModule, JasperModule ],
  declarations: [HistoricoportafoliorfComponent]
})
export class HistoricoportafoliorfModule { }
