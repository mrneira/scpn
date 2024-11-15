import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../util/shared/shared.module';
import { VacacionesRoutingModule } from './vacaciones.routing';

import { VacacionesComponent } from './componentes/vacaciones.component';

import { LovFuncionariosModule } from '../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, VacacionesRoutingModule,LovFuncionariosModule],
  declarations: [VacacionesComponent],
  exports: [VacacionesComponent]
})
export class VacacionesModule { }
