import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaCobroRoutingModule } from './consultaCobro.routing';
import { ConsultaCobroComponent } from './componentes/consultaCobro.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaCobroRoutingModule, JasperModule],
  declarations: [ConsultaCobroComponent]
})
export class ConsultaCobroModule { }
