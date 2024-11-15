import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaDesembolsoCarteraRoutingModule } from './consultaDesembolsoCartera.routing';

import { ConsultaDesembolsoCarteraComponent } from './componentes/consultaDesembolsoCartera.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, ConsultaDesembolsoCarteraRoutingModule,JasperModule],
  declarations: [ConsultaDesembolsoCarteraComponent]
})
export class ConsultaDesembolsoCarteraModule { }
