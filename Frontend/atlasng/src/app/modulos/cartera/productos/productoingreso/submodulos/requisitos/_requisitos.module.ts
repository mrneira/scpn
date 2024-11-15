import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { RequisitosRoutingModule } from './_requisitos.routing';
import { RequisitosComponent } from './componentes/_requisitos.component';
import { LovRequisitosModule } from '../../../../lov/requisitos/lov.requisitos.module';

;

@NgModule({
  imports: [SharedModule, RequisitosRoutingModule, LovRequisitosModule ],
  declarations: [RequisitosComponent],
  exports: [RequisitosComponent]
})
export class RequisitosModule { }
