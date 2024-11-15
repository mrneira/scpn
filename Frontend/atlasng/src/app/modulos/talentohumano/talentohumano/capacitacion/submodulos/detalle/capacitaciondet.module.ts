import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { CapacitacionDetalleRoutingModule } from './capacitaciondet.routing';

import { CapacitacionDetalleComponent } from './componentes/capacitaciondet.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, CapacitacionDetalleRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [CapacitacionDetalleComponent],
  exports: [CapacitacionDetalleComponent]
})
export class CapacitacionDetalleModule { }
