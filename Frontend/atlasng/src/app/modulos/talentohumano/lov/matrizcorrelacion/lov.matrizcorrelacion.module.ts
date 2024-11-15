import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovMatrizCorrelacionRoutingModule } from './lov.matrizcorrelacion.routing';
import { LovMatrizCorrelacionComponent } from './componentes/lov.matrizcorrelacion.component';

@NgModule({
  imports: [SharedModule, LovMatrizCorrelacionRoutingModule],
  declarations: [LovMatrizCorrelacionComponent],
  exports: [LovMatrizCorrelacionComponent]
})
export class LovMatrizCorrelacionModule { }

