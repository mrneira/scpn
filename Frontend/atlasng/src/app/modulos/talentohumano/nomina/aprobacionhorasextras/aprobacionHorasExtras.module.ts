import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionHorasExtrasRoutingModule } from './aprobacionHorasExtras.routing';

import { AprobacionHorasExtrasComponent } from './componentes/aprobacionHorasExtras.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, AprobacionHorasExtrasRoutingModule,LovFuncionariosModule,SplitButtonModule ],
  declarations: [AprobacionHorasExtrasComponent]
})
export class AprobacionHorasExtrasModule { }
