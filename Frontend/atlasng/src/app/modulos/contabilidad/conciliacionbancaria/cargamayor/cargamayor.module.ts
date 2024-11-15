import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { CargamayorRoutingModule } from './cargamayor.routing';
import { CargamayorComponent } from './componentes/cargamayor.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';


@NgModule({
  imports: [SharedModule, 
    CargamayorRoutingModule, 
    LovCuentasContablesModule ],
  declarations: [CargamayorComponent],
  exports: [CargamayorComponent]
})
export class CargamayorModule { }
