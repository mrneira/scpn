import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovEtapaExpedienteRoutingModule } from './lov.etapaexpediente.routing';
import { LovEtapaExpedienteComponent } from './componentes/lov.etapaexpediente.component';


@NgModule({
  imports: [SharedModule, LovEtapaExpedienteRoutingModule],
  declarations: [LovEtapaExpedienteComponent],
  exports: [LovEtapaExpedienteComponent],
})
export class LovEtapaExpedienteModule { }

