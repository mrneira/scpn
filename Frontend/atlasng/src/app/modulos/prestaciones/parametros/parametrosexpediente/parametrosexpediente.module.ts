import { ParametrosExpedienteRoutingModule } from './parametrosexpediente.routing';
import { ParametrosExpedienteComponent } from './componentes/parametros.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';


@NgModule({
  imports: [SharedModule, ParametrosExpedienteRoutingModule ],
  declarations: [ParametrosExpedienteComponent]
})
export class ParametrosExpedienteModule { }  
