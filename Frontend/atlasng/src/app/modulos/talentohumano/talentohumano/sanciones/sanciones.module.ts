import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { SancionesRoutingModule } from './sanciones.routing';
import { SancionesComponent } from './componentes/sanciones.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

import{LovPeriodoModule} from '../../lov/periodo/lov.periodo.module';
@NgModule({
  imports: [SharedModule, SancionesRoutingModule,LovFuncionariosModule,LovPeriodoModule ],
  declarations: [SancionesComponent]
})
export class SancionesModule { }
