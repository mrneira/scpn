
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { DatosRoutingModule } from './_datos.routing';
import { LovEtapaExpedienteModule } from '../../../lov/etapaexpediente/lov.etapaexpediente.module';

import { DatosComponent } from './componentes/_datos.component';
import { ExpedientesComponent } from './componentes/_expedientes.component';



@NgModule({
  imports: [SharedModule, DatosRoutingModule, LovEtapaExpedienteModule],
  declarations: [DatosComponent, ExpedientesComponent],
  exports: [DatosComponent, ExpedientesComponent]
})
export class DatosModule { }