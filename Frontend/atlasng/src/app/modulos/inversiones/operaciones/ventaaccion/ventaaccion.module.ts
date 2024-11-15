import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VentaaccionRoutingModule } from './ventaaccion.routing';

import { VentaaccionComponent } from './componentes/ventaaccion.component';

import { LovInversionesrvModule } from 'app/modulos/inversiones/lov/inversionesrv/lov.inversionesrv.module';

@NgModule({
  imports: [SharedModule, VentaaccionRoutingModule, LovInversionesrvModule ],
  declarations: [VentaaccionComponent],
  exports: [VentaaccionComponent]
})
export class VentaaccionModule { }
