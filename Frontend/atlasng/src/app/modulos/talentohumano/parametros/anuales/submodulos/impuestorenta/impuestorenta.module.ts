import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { ImpuestoRentaRoutingModule } from './impuestorenta.routing';

import { ImpuestoRentaComponent } from './componentes/impuestorenta.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, ImpuestoRentaRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [ImpuestoRentaComponent],
  exports: [ImpuestoRentaComponent]
})
export class ImpuestoRentaModule { }
