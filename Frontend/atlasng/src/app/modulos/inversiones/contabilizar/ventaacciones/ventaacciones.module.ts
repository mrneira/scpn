import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { VentaaccionesRoutingModule } from './ventaacciones.routing';
import { VentaaccionesComponent } from './componentes/ventaacciones.component';

@NgModule({
  imports: [
    SharedModule, 
    VentaaccionesRoutingModule
   ],
  declarations: [VentaaccionesComponent],
  exports: [VentaaccionesComponent]
})
export class VentaaccionesModule { }
