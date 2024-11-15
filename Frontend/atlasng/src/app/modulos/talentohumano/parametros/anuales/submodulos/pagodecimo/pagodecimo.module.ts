import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../util/shared/shared.module';
import { PagodecimoRoutingModule } from './pagodecimo.routing';

import { PagodecimoComponent } from './componentes/pagodecimo.component';

import{LovCapacitacionModule} from '../../../../lov/capacitacion/lov.capacitacion.module';
import { LovFuncionariosModule } from '../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, PagodecimoRoutingModule, LovCapacitacionModule,LovFuncionariosModule],
  declarations: [PagodecimoComponent],
  exports: [PagodecimoComponent]
})
export class PagodecimoModule { }
