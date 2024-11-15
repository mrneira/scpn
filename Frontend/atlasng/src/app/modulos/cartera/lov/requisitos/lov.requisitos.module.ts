import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovRequisitosRoutingModule } from './lov.requisitos.routing';
import { LovRequisitosComponent } from './componentes/lov.requisitos.component';

@NgModule({
  imports: [SharedModule, LovRequisitosRoutingModule],
  declarations: [LovRequisitosComponent],
  exports: [LovRequisitosComponent]
})
export class LovRequisitosModule { }

