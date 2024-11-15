import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AuxiliarcontableinversionesRoutingModule } from './auxiliarcontableinversiones.routing';
import { AuxiliarcontableinversionesComponent } from './componentes/auxiliarcontableinversiones.component';
import { JasperModule } from '../../../../util/componentes/jasper/jasper.module';
import { LovCuentasContablesModule } from '../../../contabilidad/lov/cuentascontables/lov.cuentasContables.module';

@NgModule({
  imports: [SharedModule, AuxiliarcontableinversionesRoutingModule, JasperModule, LovCuentasContablesModule],
  declarations: [AuxiliarcontableinversionesComponent]
})
export class AuxiliarcontableinversionesModule { }
