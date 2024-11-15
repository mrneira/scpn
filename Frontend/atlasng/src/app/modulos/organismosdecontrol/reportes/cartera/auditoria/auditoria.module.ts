import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { AuditoriaRoutingModule } from './auditoria.routing';

import { AuditoriaComponent } from './componentes/auditoria.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';


@NgModule({
  imports: [SharedModule, AuditoriaRoutingModule, JasperModule ],
  declarations: [AuditoriaComponent]
})
export class AuditoriaModule { }
