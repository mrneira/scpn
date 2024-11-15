import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { ExpedienteRoutingModule } from './expediente.routing';

import { ExpedienteComponent } from './componentes/expediente.component';

import { SplitButtonModule } from 'primeng/components/splitbutton/splitbutton';
@NgModule({
  imports: [SharedModule, ExpedienteRoutingModule,SplitButtonModule ],
  declarations: [ExpedienteComponent]
})
export class ExpedienteModule { }
