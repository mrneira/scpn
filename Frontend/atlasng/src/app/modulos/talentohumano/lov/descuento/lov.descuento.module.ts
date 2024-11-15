import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDescuentoRoutingModule } from './lov.descuento.routing';
import { LovDescuentoComponent } from './componentes/lov.descuento.component';

@NgModule({
  imports: [SharedModule, LovDescuentoRoutingModule],
  declarations: [LovDescuentoComponent],
  exports: [LovDescuentoComponent]
})
export class LovDescuentoModule { }

