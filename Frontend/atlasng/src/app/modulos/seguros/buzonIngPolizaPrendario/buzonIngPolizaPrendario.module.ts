import { NgModule } from '@angular/core';
import { SharedModule } from '../../../util/shared/shared.module';
import { BuzonIngPolizaPrendarioRoutingModule } from './buzonIngPolizaPrendario.routing';

import { BuzonIngPolizaPrendarioComponent } from './componentes/buzonIngPolizaPrendario.component';


@NgModule({
  imports: [SharedModule, BuzonIngPolizaPrendarioRoutingModule ],
  declarations: [BuzonIngPolizaPrendarioComponent]
})
export class BuzonIngPolizaPrendarioModule { }
