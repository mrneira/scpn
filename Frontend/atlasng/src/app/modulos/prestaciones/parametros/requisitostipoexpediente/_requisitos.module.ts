import { LovRequisitosExpedienteModule } from './../../lov/requisitos/lov.requisitosexpediente.module';
import { SharedModule } from './../../../../util/shared/shared.module';
import { NgModule } from '@angular/core';
import { RequisitosRoutingModule } from './_requisitos.routing';
import { RequisitosComponent } from './componentes/_requisitos.component';


@NgModule({
  imports: [SharedModule, RequisitosRoutingModule, LovRequisitosExpedienteModule ],
  declarations: [RequisitosComponent],
  exports: [RequisitosComponent]
})
export class RequisitosModule { }
