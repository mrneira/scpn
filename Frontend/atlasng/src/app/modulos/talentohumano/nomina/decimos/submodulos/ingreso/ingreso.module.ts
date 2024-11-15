import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { IngresoRoutingModule } from './ingreso.routing';

import { IngresoComponent } from './componentes/ingreso.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, IngresoRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [IngresoComponent],
  exports: [IngresoComponent]
})
export class IngresoModule { }
