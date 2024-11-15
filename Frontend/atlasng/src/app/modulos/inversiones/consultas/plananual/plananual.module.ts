import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../util/shared/shared.module';
import { PlanAnualRoutingModule } from './plananual.routing';

import { PlanAnualComponent } from './componentes/plananual.component';


@NgModule({
  imports: [SharedModule, PlanAnualRoutingModule ],
  declarations: [PlanAnualComponent]
})
export class PlanAnualModule { }
