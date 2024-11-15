import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { TablaAmortizacionRoutingRouting } from './_tablaAmortizacion.routing';
import { TablaAmortizacionComponent } from './componentes/_tablaAmortizacion.component';
import { JasperModule } from '../../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, TablaAmortizacionRoutingRouting, JasperModule ],
  declarations: [TablaAmortizacionComponent],
  exports: [TablaAmortizacionComponent]
})
export class TablaAmortizacionModule { }
