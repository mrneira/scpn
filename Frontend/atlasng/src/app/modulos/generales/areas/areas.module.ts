import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { AreasRoutingModule } from './areas.routing';

import { AreasComponent } from './componentes/areas.component';


@NgModule({
  imports: [SharedModule, AreasRoutingModule ],
  declarations: [AreasComponent]
})
export class AreasModule { }
