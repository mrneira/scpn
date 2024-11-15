import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { LovDesignacionesRoutingModule } from './lov.designaciones.routing';

import { LovDesignacionesComponent } from './componentes/lov.designaciones.component';
import { LovFuncionariosModule } from '../funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, LovDesignacionesRoutingModule, LovFuncionariosModule],
  declarations: [LovDesignacionesComponent],
  exports: [LovDesignacionesComponent],
})
export class LovDesignacionesModule { }

