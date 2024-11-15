import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HorarioFuncionarioRoutingModule } from './horarioFuncionario.routing';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

import { HorarioFuncionarioComponent } from './componentes/horarioFuncionario.component';
import {InputMaskModule} from 'primeng/primeng';

@NgModule({
  imports: [SharedModule, HorarioFuncionarioRoutingModule, InputMaskModule,LovFuncionariosModule ],
  declarations: [HorarioFuncionarioComponent]
})
export class HorarioFuncionarioModule { }
