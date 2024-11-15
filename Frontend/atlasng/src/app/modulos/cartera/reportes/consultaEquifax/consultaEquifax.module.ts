import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { ConsultaEquifaxRoutingModule } from './consultaEquifax.routing';

import { ConsultaEquifaxComponent } from './componentes/consultaEquifax.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, ConsultaEquifaxRoutingModule, JasperModule],
  declarations: [ConsultaEquifaxComponent]
})
export class ConsultaEquifaxModule { }
