import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { AprobacionAtrasosRoutingModule } from './aprobacionatrasos.routing';

import { AprobacionAtrasosComponent } from './componentes/aprobacionatrasos.component';
import { LovFuncionariosModule } from '../../lov/funcionarios/lov.funcionarios.module';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';

@NgModule({
  imports: [SharedModule, AprobacionAtrasosRoutingModule,LovFuncionariosModule,SplitButtonModule ],
  declarations: [AprobacionAtrasosComponent]
})
export class AprobacionAtrasosModule { }
