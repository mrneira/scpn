import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { AcumulacionesRoutingModule } from './acumulaciones.routing';

import { AcumulacionesComponent } from './componentes/acumulaciones.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, AcumulacionesRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [AcumulacionesComponent],
  exports: [AcumulacionesComponent]
})
export class AcumulacionesModule { }
