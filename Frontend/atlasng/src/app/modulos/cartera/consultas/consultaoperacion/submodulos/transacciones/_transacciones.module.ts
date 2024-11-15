import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { TransaccionesRoutingModule } from './_transacciones.routing';
import { TransaccionesComponent } from './componentes/_transacciones.component';

@NgModule({
  imports: [SharedModule, TransaccionesRoutingModule ],
  declarations: [TransaccionesComponent],
  exports: [TransaccionesComponent]
})
export class TransaccionesModule { }
