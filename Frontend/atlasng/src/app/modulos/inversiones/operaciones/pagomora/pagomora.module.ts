import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PagomoraRoutingModule } from './pagomora.routing';
import { PagomoraComponent } from './componentes/pagomora.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { CuotasModule } from './submodulos/cuotas/cuotas.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';

@NgModule({
  imports: [
    SharedModule, 
    PagomoraRoutingModule, 
    LovInversionesModule,
    CuotasModule,
    LovPersonasModule, 
    LovCuentasContablesModule ],
  declarations: [PagomoraComponent],
  exports: [PagomoraComponent]
})
export class PagomoraModule { }
