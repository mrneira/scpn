import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { DetalleRoutingModule } from './detalle.routing';

import { DetalleComponent } from './componentes/detalle.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, DetalleRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [DetalleComponent],
  exports: [DetalleComponent]
})
export class DetalleModule { }
