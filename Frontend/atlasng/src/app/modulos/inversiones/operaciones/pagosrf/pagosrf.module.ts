import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagosrfRoutingModule } from './pagosrf.routing';
import { PagosrfComponent } from './componentes/pagosrf.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { CuotasModule } from './submodulos/cuotas/cuotas.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [
    SharedModule, 
    PagosrfRoutingModule, 
    LovInversionesModule,
    CuotasModule,
    LovPersonasModule, 
    LovCuentasContablesModule ],
  declarations: [PagosrfComponent],
  exports: [PagosrfComponent]
})
export class PagosrfModule { }
