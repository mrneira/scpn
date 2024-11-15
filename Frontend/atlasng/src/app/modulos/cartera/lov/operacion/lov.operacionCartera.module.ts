import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovOperacionCarteraRoutingModule } from './lov.operacionCartera.routing';
import { LovOperacionCarteraComponent } from './componentes/lov.operacionCartera.component';

@NgModule({
  imports: [SharedModule, LovOperacionCarteraRoutingModule],
  declarations: [LovOperacionCarteraComponent],
  exports: [LovOperacionCarteraComponent]
})
export class LovOperacionCarteraModule { }

