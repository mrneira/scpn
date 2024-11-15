import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { RolpagoRoutingModule } from './rolpago.routing';

import { RolpagoComponent } from './componentes/rolpago.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, RolpagoRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [RolpagoComponent],
  exports: [RolpagoComponent]
})
export class RolPagoModule { }
