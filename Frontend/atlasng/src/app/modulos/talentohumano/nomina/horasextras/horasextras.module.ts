import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { HorasextrasRoutingModule } from './horasextras.routing';

import { HorasextrasComponent } from './componentes/horasextras.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';


import{ParametroAnualModule} from '../../lov/parametroanual/lov.parametroanual.module';
@NgModule({
  imports: [SharedModule, HorasextrasRoutingModule,LovFuncionariosModule ,ParametroAnualModule],
  declarations: [HorasextrasComponent]
})
export class HorasextrasModule { }
