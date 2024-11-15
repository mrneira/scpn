import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { MovimientosContablesCarteraRoutingModule } from './movimientosContablesCartera.routing';
import { MovimientosContablesCarteraComponent } from './componentes/movimientosContablesCartera.component';
import { LovPersonasModule } from '../../../personas/lov/personas/lov.personas.module';
import { LovOperacionCarteraModule } from '../../lov/operacion/lov.operacionCartera.module';
import { LovTransaccionesModule } from '../../../generales/lov/transacciones/lov.transacciones.module';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';

@NgModule({
  imports: [SharedModule, MovimientosContablesCarteraRoutingModule, LovPersonasModule, LovOperacionCarteraModule, LovTransaccionesModule, JasperModule],
  declarations: [MovimientosContablesCarteraComponent]
})
export class MovimientosContablesCarteraModule { }
