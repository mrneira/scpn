import { TirRoutingModule } from './tir.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TirComponent } from './componentes/tir.component';

@NgModule({
  imports: [SharedModule, TirRoutingModule ],
  declarations: [TirComponent],
  exports: [TirComponent]
})
export class TirModule { }
