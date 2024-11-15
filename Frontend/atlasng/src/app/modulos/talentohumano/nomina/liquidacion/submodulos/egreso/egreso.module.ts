import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { EgresoRoutingModule } from './egreso.routing';

import { EgresoComponent } from './componentes/egreso.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, EgresoRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [EgresoComponent],
  exports: [EgresoComponent]
})
export class EgresoModule { }
