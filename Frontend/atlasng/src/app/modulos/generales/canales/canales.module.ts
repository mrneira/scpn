import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { CanalesRoutingModule } from './canales.routing';

import { CanalesComponent } from './componentes/canales.component';


@NgModule({
  imports: [SharedModule, CanalesRoutingModule ],
  declarations: [CanalesComponent]
})
export class CanalesModule { }
