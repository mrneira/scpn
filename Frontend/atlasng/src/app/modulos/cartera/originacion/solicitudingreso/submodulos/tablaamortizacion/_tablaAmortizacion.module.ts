import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TablaAmortizacionRoutingRouting } from './_tablaAmortizacion.routing';
import { TablaAmortizacionComponent } from './componentes/_tablaAmortizacion.component';

@NgModule({
  imports: [SharedModule, TablaAmortizacionRoutingRouting ],
  declarations: [TablaAmortizacionComponent],
  exports: [TablaAmortizacionComponent]
})
export class TablaAmortizacionModule { }
