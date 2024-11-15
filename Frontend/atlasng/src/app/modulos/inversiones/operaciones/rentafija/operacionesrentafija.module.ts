import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { OperacionesrentafijaRoutingModule } from './operacionesrentafija.routing';
import { LovTablaamortizacionModule } from '../../../inversiones/lov/tablaamortizacion/lov.tablaamortizacion.module';
import { LovInversionesModule } from '../../../inversiones/lov/inversiones/lov.inversiones.module';
import { OperacionesrentafijaComponent } from './componentes/operacionesrentafija.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [
    SharedModule, 
    OperacionesrentafijaRoutingModule, 
    LovTablaamortizacionModule, 
    LovInversionesModule, 
    LovCuentasContablesModule ],
  declarations: [OperacionesrentafijaComponent],
  exports: [OperacionesrentafijaComponent]
})
export class OperacionesrentafijaModule { }
