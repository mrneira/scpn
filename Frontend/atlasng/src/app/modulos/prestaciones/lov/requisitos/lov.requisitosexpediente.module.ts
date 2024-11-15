import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovRequisitosExpedienteRoutingModule } from './lov.requisitosexpediente.routing';

import { LovRequisitosExpedienteComponent } from './componentes/lov.requisitosexpediente.component';


@NgModule({
  imports: [SharedModule, LovRequisitosExpedienteRoutingModule],
  declarations: [LovRequisitosExpedienteComponent],
  exports: [LovRequisitosExpedienteComponent]
})
export class LovRequisitosExpedienteModule { }

