import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { PagoSeguroRoutingModule } from './pagoSeguro.routing';

import { PagoSeguroComponent } from './componentes/pagoSeguro.component';
import { PolizaComponent } from './componentes/_poliza.component';

@NgModule({
  imports: [SharedModule, PagoSeguroRoutingModule],
  declarations: [PagoSeguroComponent, PolizaComponent]
})
export class PagoSeguroModule { }
