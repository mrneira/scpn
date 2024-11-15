import { TablamortizacionRoutingModule } from './tablamortizacion.routing';
import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TablamortizacionComponent } from './componentes/tablamortizacion.component';

@NgModule({
  imports: [SharedModule, TablamortizacionRoutingModule ],
  declarations: [TablamortizacionComponent],
  exports: [TablamortizacionComponent]
})
export class TablamortizacionModule { }
