import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaCancelacionCarteraRoutingModule } from './consultaCancelacionCartera.routing';

import { ConsultaCancelacionCarteraComponent } from './componentes/consultaCancelacionCartera.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, ConsultaCancelacionCarteraRoutingModule,JasperModule],
  declarations: [ConsultaCancelacionCarteraComponent]
})
export class ConsultaCancelacionCarteraModule { }
