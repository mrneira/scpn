import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { TiposTablaAmortizacionRoutingModule } from './tiposTablaAmortizacion.routing';

import { TiposTablaAmortizacionComponent } from './componentes/tiposTablaAmortizacion.component';


@NgModule({
  imports: [SharedModule, TiposTablaAmortizacionRoutingModule ],
  declarations: [TiposTablaAmortizacionComponent]
})
export class TiposTablaAmortizacionModule { }
