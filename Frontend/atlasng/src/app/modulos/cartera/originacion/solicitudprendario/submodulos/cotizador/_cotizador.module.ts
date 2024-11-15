import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CotizadorRoutingModule } from './_cotizador.routing';
import { CotizadorComponent } from './componentes/_cotizador.component';

@NgModule({
  imports: [SharedModule, CotizadorRoutingModule],
  declarations: [CotizadorComponent],
  exports: [CotizadorComponent]

})
export class CotizadorModule { }
