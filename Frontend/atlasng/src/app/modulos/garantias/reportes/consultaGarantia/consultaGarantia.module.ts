import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaGarantiaRoutingModule } from './consultaGarantia.routing';

import { ConsultaGarantiaComponent } from './componentes/consultaGarantia.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';



@NgModule({
  imports: [SharedModule, ConsultaGarantiaRoutingModule, JasperModule ],
  declarations: [ConsultaGarantiaComponent]

})
export class ConsultaGarantiaModule { }
