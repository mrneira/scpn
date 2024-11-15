import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../../../../util/shared/shared.module';
import { HoraExtraRoutingModule } from './horasextras.routing';

import { HorasExtrasComponent } from './componentes/horasextras.component';

import { LovFuncionariosModule } from '../../../../../lov/funcionarios/lov.funcionarios.module';

@NgModule({
  imports: [SharedModule, HoraExtraRoutingModule, LovFuncionariosModule],
  declarations: [HorasExtrasComponent],
  exports:[HorasExtrasComponent]
})
export class HorasExtrasModule { }
