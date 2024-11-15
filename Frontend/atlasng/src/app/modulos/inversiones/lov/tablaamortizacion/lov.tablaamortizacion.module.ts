import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovTablaamortizacionRoutingModule } from './lov.tablaamortizacion.routing';
import { LovTablaamortizacionComponent } from './componentes/lov.tablaamortizacion.component';

@NgModule({
  imports: [SharedModule, LovTablaamortizacionRoutingModule ],
  declarations: [LovTablaamortizacionComponent],
  exports: [LovTablaamortizacionComponent],
})
export class LovTablaamortizacionModule { }