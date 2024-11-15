import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { MantenimientolibrobancoComponent } from './componentes/mantenimientolibrobanco.component';
import { MantenimientolibrobancoRoutingModule } from './mantenimientolibrobanco.routing';

@NgModule({
  imports: [SharedModule, MantenimientolibrobancoRoutingModule, LovCuentasContablesModule ],
  declarations: [MantenimientolibrobancoComponent],
  exports: [MantenimientolibrobancoComponent]
})
export class MantenimientolibrobancoModule { }
