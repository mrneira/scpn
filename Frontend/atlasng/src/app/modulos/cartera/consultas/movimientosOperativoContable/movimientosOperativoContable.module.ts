import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MovimientosOperativoContableRoutingModule } from './movimientosOperativoContable.routing';
import { MovimientosOperativoContableComponent } from './componentes/movimientosOperativoContable.component';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, MovimientosOperativoContableRoutingModule, LovCuentasContablesModule, JasperModule],
  declarations: [MovimientosOperativoContableComponent]
})
export class MovimientosOperativoContableModule { }
