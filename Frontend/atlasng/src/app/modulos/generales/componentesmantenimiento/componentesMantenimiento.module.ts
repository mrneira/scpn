import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ComponentesMantenimientoRoutingModule } from './componentesMantenimiento.routing';

import { ComponentesMantenimientoComponent } from './componentes/componentesMantenimiento.component';
import { LovTransaccionesModule } from '../lov/transacciones/lov.transacciones.module';


@NgModule({
  imports: [SharedModule, ComponentesMantenimientoRoutingModule, LovTransaccionesModule ],
  declarations: [ComponentesMantenimientoComponent]
})
export class ComponentesMantenimientoModule { }
