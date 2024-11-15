import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaRecuperacionCarteraRoutingModule } from './consultaRecuperacionCartera.routing';

import { ConsultaRecuperacionCarteraComponent } from './componentes/consultaRecuperacionCartera.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';



@NgModule({
  imports: [SharedModule, ConsultaRecuperacionCarteraRoutingModule,JasperModule],
  declarations: [ConsultaRecuperacionCarteraComponent]
})
export class ConsultaRecuperacionCarteraModule { }
